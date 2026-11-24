-- =========================================================
-- GRUPO COMALBA · Solicitudes de visita
-- Correr DESPUÉS de esquema.sql: SQL Editor → New query → pegar → Run.
-- Se puede volver a correr sin perder datos.
--
-- El formulario «Solicitar una visita» de la ficha (sitio y enlace sin datos)
-- guarda aquí los datos del interesado; el equipo los ve en el panel → Solicitudes.
-- El público NO puede leer esta tabla: solo registra con la función de abajo.
-- =========================================================

create table if not exists public.solicitudes (
  id             uuid primary key default gen_random_uuid(),
  publicacion_id text references public.publicaciones (id) on delete set null,
  origen         text not null check (origen in ('sitio', 'enlace')),
  codigo_enlace  text,
  nombre         text not null check (char_length(nombre) between 1 and 120),
  correo         text not null default '' check (char_length(correo) <= 200),
  telefono       text not null default '' check (char_length(telefono) <= 40),
  mensaje        text not null default '' check (char_length(mensaje) <= 1000),
  atendida       boolean not null default false,
  creada_en      timestamptz not null default now()
);

alter table public.solicitudes enable row level security;

drop policy if exists "equipo administra solicitudes" on public.solicitudes;
create policy "equipo administra solicitudes" on public.solicitudes
  for all to authenticated using (true) with check (true);

grant select, update, delete on public.solicitudes to authenticated;

-- Registro público. Desde el sitio llega el id de la publicación; desde el enlace sin
-- datos llega solo el código (la ficha compartida nunca expone el id).
-- Devuelve true si se guardó.
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
  v_origen      text;
begin
  if coalesce(trim(p_nombre), '') = '' or (coalesce(trim(p_correo), '') = '' and coalesce(trim(p_telefono), '') = '') then
    return false;
  end if;

  if p_codigo is not null and p_codigo <> '' then
    select e.publicacion_id into v_publicacion
    from enlaces_compartidos e
    join publicaciones p on p.id = e.publicacion_id
    where e.codigo = p_codigo and e.activo and (e.vence_en is null or e.vence_en > now())
      and p.publicada and p.eliminada_en is null;
    v_origen := 'enlace';
  else
    select p.id into v_publicacion
    from publicaciones p
    where p.id = p_publicacion and p.publicada and p.eliminada_en is null;
    v_origen := 'sitio';
  end if;

  if v_publicacion is null then
    return false;
  end if;

  insert into solicitudes (publicacion_id, origen, codigo_enlace, nombre, correo, telefono, mensaje)
  values (
    v_publicacion,
    v_origen,
    nullif(p_codigo, ''),
    left(trim(p_nombre), 120),
    left(trim(coalesce(p_correo, '')), 200),
    left(trim(coalesce(p_telefono, '')), 40),
    left(trim(coalesce(p_mensaje, '')), 1000)
  );
  return true;
end;
$$;

revoke all on function public.registrar_solicitud(text, text, text, text, text, text) from public;
grant execute on function public.registrar_solicitud(text, text, text, text, text, text) to anon, authenticated;
