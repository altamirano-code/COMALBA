-- =========================================================
-- GRUPO COMALBA · Todos los formularios guardan su lead
-- Correr DESPUÉS de 02_solicitudes.sql: SQL Editor → New query → pegar → Run.
-- Se puede volver a correr sin perder datos.
--
-- Hasta ahora solo «Solicitar una visita» (ficha) se guardaba. Con este archivo
-- también se guardan el formulario de cada división, el de propietarios del
-- inicio (vender, rentar, valuar) y el cotizador de mudanzas (cuestionario 5.4 y 5.6).
-- El panel los muestra en Solicitudes y los exporta a Excel.
-- =========================================================

-- ---------- 1. Columnas nuevas ----------
-- formulario: de dónde llegó el lead.
-- area:       división que lo atiende (mismo slug que las páginas: albavera, civ-rentas…).
-- datos:      campos propios de cada formulario, en orden: [{"etiqueta": "...", "valor": "..."}].
alter table public.solicitudes add column if not exists formulario text not null default 'visita';
alter table public.solicitudes add column if not exists area text;
alter table public.solicitudes add column if not exists datos jsonb not null default '[]'::jsonb;

alter table public.solicitudes drop constraint if exists solicitudes_formulario_check;
alter table public.solicitudes add constraint solicitudes_formulario_check
  check (formulario in ('visita', 'area', 'propietario', 'mudanza'));

alter table public.solicitudes drop constraint if exists solicitudes_area_check;
alter table public.solicitudes add constraint solicitudes_area_check
  check (area is null or area in ('albavera', 'civ-rentas', 'asesoria-proyectos', 'aqmen', 'immor', 'financiamiento'));

-- Las visitas ya registradas toman el área de su propiedad.
update public.solicitudes s
set area = p.seccion
from public.publicaciones p
where s.area is null and s.publicacion_id = p.id;

create index if not exists solicitudes_creada_en_idx on public.solicitudes (creada_en desc);

-- ---------- 2. Visitas: ahora también guardan el área ----------
create or replace function public.registrar_solicitud(
  p_publicacion text,
  p_codigo      text,
  p_nombre      text,
  p_correo      text,
  p_telefono    text,
  p_mensaje     text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_publicacion text;
  v_seccion     text;
  v_origen      text;
begin
  if coalesce(trim(p_nombre), '') = '' or (coalesce(trim(p_correo), '') = '' and coalesce(trim(p_telefono), '') = '') then
    return false;
  end if;

  if p_codigo is not null and p_codigo <> '' then
    select e.publicacion_id, p.seccion into v_publicacion, v_seccion
    from enlaces_compartidos e
    join publicaciones p on p.id = e.publicacion_id
    where e.codigo = p_codigo and e.activo and (e.vence_en is null or e.vence_en > now())
      and p.publicada and p.eliminada_en is null;
    v_origen := 'enlace';
  else
    select p.id, p.seccion into v_publicacion, v_seccion
    from publicaciones p
    where p.id = p_publicacion and p.publicada and p.eliminada_en is null;
    v_origen := 'sitio';
  end if;

  if v_publicacion is null then
    return false;
  end if;

  insert into solicitudes (publicacion_id, origen, codigo_enlace, formulario, area, nombre, correo, telefono, mensaje)
  values (
    v_publicacion,
    v_origen,
    nullif(p_codigo, ''),
    'visita',
    v_seccion,
    left(trim(p_nombre), 120),
    left(trim(coalesce(p_correo, '')), 200),
    left(trim(coalesce(p_telefono, '')), 40),
    left(trim(coalesce(p_mensaje, '')), 1000)
  );
  return true;
end;
$$;

-- ---------- 3. Registro público de los demás formularios ----------
-- p_datos: arreglo [{"etiqueta": "...", "valor": "..."}]. Se limpia aquí: máximo 15 campos,
-- etiquetas de 80 y valores de 300 caracteres; lo vacío se descarta.
-- Devuelve true si se guardó.
create or replace function public.registrar_lead(
  p_formulario text,
  p_area       text,
  p_nombre     text,
  p_correo     text,
  p_telefono   text,
  p_mensaje    text,
  p_datos      jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_datos jsonb;
begin
  if p_formulario not in ('area', 'propietario', 'mudanza') then
    return false;
  end if;
  if p_area is null or p_area not in ('albavera', 'civ-rentas', 'asesoria-proyectos', 'aqmen', 'immor', 'financiamiento') then
    return false;
  end if;
  if coalesce(trim(p_nombre), '') = '' or (coalesce(trim(p_correo), '') = '' and coalesce(trim(p_telefono), '') = '') then
    return false;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('etiqueta', etiqueta, 'valor', valor) order by orden), '[]'::jsonb)
  into v_datos
  from (
    select
      left(trim(e ->> 'etiqueta'), 80) as etiqueta,
      left(trim(e ->> 'valor'), 300)   as valor,
      orden
    from jsonb_array_elements(case when jsonb_typeof(p_datos) = 'array' then p_datos else '[]'::jsonb end)
      with ordinality as t(e, orden)
    where jsonb_typeof(e) = 'object'
      and coalesce(trim(e ->> 'etiqueta'), '') <> ''
      and coalesce(trim(e ->> 'valor'), '') <> ''
    order by orden
    limit 15
  ) limpio;

  insert into solicitudes (publicacion_id, origen, formulario, area, nombre, correo, telefono, mensaje, datos)
  values (
    null,
    'sitio',
    p_formulario,
    p_area,
    left(trim(p_nombre), 120),
    left(trim(coalesce(p_correo, '')), 200),
    left(trim(coalesce(p_telefono, '')), 40),
    left(trim(coalesce(p_mensaje, '')), 1000),
    v_datos
  );
  return true;
end;
$$;

revoke all on function public.registrar_lead(text, text, text, text, text, text, jsonb) from public;
grant execute on function public.registrar_lead(text, text, text, text, text, text, jsonb) to anon, authenticated;
