-- =========================================================
-- GRUPO COMALBA · Solo el equipo administra
-- Correr DESPUÉS de 04_papelera_solicitudes.sql: SQL Editor → New query → pegar → Run.
-- Se puede volver a correr sin perder datos.
--
-- Antes, cualquier usuario con sesión ("authenticated") podía leer los leads y
-- editar o borrar publicaciones, fotos y enlaces. Como Supabase permite crear
-- cuentas desde fuera, eso dejaba la puerta abierta a cualquiera.
-- Ahora solo cuentan los usuarios anotados en la tabla "equipo".
--
-- IMPORTANTE: al terminar, agrega a tu equipo (paso 5, al final del archivo).
-- Mientras la tabla esté vacía, NADIE puede entrar al panel.
-- =========================================================

-- ---------- 1. Tabla del equipo ----------
create table if not exists public.equipo (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  creado_en  timestamptz not null default now()
);

alter table public.equipo enable row level security;

-- Cada quien solo puede ver su propia fila. Nadie la modifica desde la API:
-- altas y bajas se hacen aquí, en el SQL Editor.
drop policy if exists "cada quien ve su fila" on public.equipo;
create policy "cada quien ve su fila" on public.equipo
  for select to authenticated using (user_id = auth.uid());

revoke all on public.equipo from anon, authenticated;
grant select on public.equipo to authenticated;

-- ---------- 2. ¿La sesión actual es del equipo? ----------
-- security definer: se usa dentro de las políticas sin depender de la RLS de "equipo".
create or replace function public.es_equipo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.equipo where user_id = auth.uid());
$$;

revoke all on function public.es_equipo() from public;
grant execute on function public.es_equipo() to anon, authenticated;

-- ---------- 3. Publicaciones, enlaces y solicitudes ----------
-- (El público sigue igual: lee lo publicado y registra con las funciones de 02/03.)
drop policy if exists "equipo lee todo" on public.publicaciones;
create policy "equipo lee todo" on public.publicaciones
  for select to authenticated using (public.es_equipo());

-- Una cuenta que no es del equipo ve el sitio como cualquier visitante.
drop policy if exists "publico con sesion lee publicadas" on public.publicaciones;
create policy "publico con sesion lee publicadas" on public.publicaciones
  for select to authenticated using (publicada and eliminada_en is null);

drop policy if exists "equipo crea" on public.publicaciones;
create policy "equipo crea" on public.publicaciones
  for insert to authenticated with check (public.es_equipo());

drop policy if exists "equipo edita" on public.publicaciones;
create policy "equipo edita" on public.publicaciones
  for update to authenticated using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "equipo borra" on public.publicaciones;
create policy "equipo borra" on public.publicaciones
  for delete to authenticated using (public.es_equipo());

drop policy if exists "equipo administra enlaces" on public.enlaces_compartidos;
create policy "equipo administra enlaces" on public.enlaces_compartidos
  for all to authenticated using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "equipo administra solicitudes" on public.solicitudes;
create policy "equipo administra solicitudes" on public.solicitudes
  for all to authenticated using (public.es_equipo()) with check (public.es_equipo());

-- ---------- 4. Fotos (Storage) ----------
drop policy if exists "equipo sube fotos" on storage.objects;
create policy "equipo sube fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'fotos' and public.es_equipo());

drop policy if exists "equipo reemplaza fotos" on storage.objects;
create policy "equipo reemplaza fotos" on storage.objects
  for update to authenticated using (bucket_id = 'fotos' and public.es_equipo());

drop policy if exists "equipo borra fotos" on storage.objects;
create policy "equipo borra fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'fotos' and public.es_equipo());

-- ---------- 5. Agregar al equipo (hazlo a mano) ----------
-- a) Revisa quién tiene cuenta. Si ves correos que no conoces, bórralos en
--    Authentication → Users antes de seguir:
--
--      select id, email, created_at, last_sign_in_at from auth.users order by created_at;
--
-- b) Agrega a cada persona del equipo por su correo (cambia los correos):
--
--      insert into public.equipo (user_id)
--      select id from auth.users where email in ('persona1@ejemplo.com', 'persona2@ejemplo.com')
--      on conflict do nothing;
--
-- c) Para quitar a alguien:
--
--      delete from public.equipo where user_id = (select id from auth.users where email = 'persona@ejemplo.com');
