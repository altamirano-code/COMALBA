-- =========================================================
-- GRUPO COMALBA · Formulario de contacto general del inicio
-- Correr DESPUÉS de 05_equipo.sql: SQL Editor → New query → pegar → Run.
-- Se puede volver a correr sin perder datos.
--
-- El formulario "Hablemos de tu próxima propiedad" (sección Contacto del
-- inicio) guarda su lead como formulario 'contacto', sin división (área vacía).
-- Mientras no se corra este archivo, ese formulario sigue abriendo WhatsApp,
-- pero la solicitud no llega al panel.
-- =========================================================

alter table public.solicitudes drop constraint if exists solicitudes_formulario_check;
alter table public.solicitudes add constraint solicitudes_formulario_check
  check (formulario in ('visita', 'area', 'propietario', 'mudanza', 'contacto'));

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
  v_area  text;
begin
  if p_formulario not in ('area', 'propietario', 'mudanza', 'contacto') then
    return false;
  end if;

  -- El contacto general no pertenece a una división; los demás formularios sí
  if p_formulario = 'contacto' then
    v_area := null;
  elsif p_area is null or p_area not in ('albavera', 'civ-rentas', 'asesoria-proyectos', 'aqmen', 'immor', 'financiamiento') then
    return false;
  else
    v_area := p_area;
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
    v_area,
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
