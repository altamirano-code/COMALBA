-- =========================================================
-- GRUPO COMALBA · Esquema de Supabase
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo → Run.
-- Se puede volver a correr sin perder datos (usa "if not exists" / "or replace").
-- =========================================================

-- ---------- 1. Publicaciones ----------
create table if not exists public.publicaciones (
  id               text primary key,
  clave            text not null default '',
  seccion          text not null check (seccion in ('albavera', 'civ-rentas', 'aqmen')),
  operacion        text not null,
  categoria        text not null,
  titulo           text not null default '',
  descripcion      text not null default '',
  precio           numeric,
  precio_desde     boolean not null default false,
  forma_pago       text not null default '',
  colonia          text not null default '',
  municipio        text not null default '',
  estado           text not null default '',
  terreno_m2       numeric,
  construccion_m2  numeric,
  recamaras        numeric,
  banos            numeric,
  estacionamientos numeric,
  huespedes        numeric,
  extras           text[] not null default '{}',
  fotos            text[] not null default '{}',
  video            text not null default '',
  mapa             text not null default '',
  publicada        boolean not null default true,
  destacada        boolean not null default false,
  creada_en        timestamptz not null default now(),
  actualizada_en   timestamptz not null default now(),
  eliminada_en     timestamptz
);

alter table public.publicaciones enable row level security;

-- El público solo ve lo publicado y fuera de la papelera; el equipo (con sesión) ve y edita todo.
drop policy if exists "publico lee publicadas" on public.publicaciones;
create policy "publico lee publicadas" on public.publicaciones
  for select to anon using (publicada and eliminada_en is null);

drop policy if exists "equipo lee todo" on public.publicaciones;
create policy "equipo lee todo" on public.publicaciones
  for select to authenticated using (true);

drop policy if exists "equipo crea" on public.publicaciones;
create policy "equipo crea" on public.publicaciones
  for insert to authenticated with check (true);

drop policy if exists "equipo edita" on public.publicaciones;
create policy "equipo edita" on public.publicaciones
  for update to authenticated using (true) with check (true);

drop policy if exists "equipo borra" on public.publicaciones;
create policy "equipo borra" on public.publicaciones
  for delete to authenticated using (true);

-- ---------- 2. Fotos (Storage) ----------
-- Bucket público de solo lectura: cualquiera ve una foto si tiene su URL; solo el equipo sube o borra.
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists "equipo sube fotos" on storage.objects;
create policy "equipo sube fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'fotos');

drop policy if exists "equipo reemplaza fotos" on storage.objects;
create policy "equipo reemplaza fotos" on storage.objects
  for update to authenticated using (bucket_id = 'fotos');

drop policy if exists "equipo borra fotos" on storage.objects;
create policy "equipo borra fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'fotos');

-- ---------- 3. Enlaces sin datos ----------
-- Un enlace por publicación. Regenerarlo cambia el código y el anterior deja de servir.
create table if not exists public.enlaces_compartidos (
  publicacion_id    text primary key references public.publicaciones (id) on delete cascade,
  codigo            text not null unique,
  activo            boolean not null default true,
  vence_en          timestamptz,
  mostrar_precio    boolean not null default false, -- apagado: la ficha muestra "$$$"
  mostrar_ubicacion boolean not null default true,  -- solo colonia, municipio y estado; nunca mapa
  permitir_aliadas  boolean not null default true,  -- muestra "Compartir sin datos" en la página pública
  nota_adicional    text not null default '',
  creado_en         timestamptz not null default now(),
  creado_por        uuid default auth.uid() references auth.users (id) on delete set null
);

alter table public.enlaces_compartidos enable row level security;

-- Solo el equipo lee o modifica la tabla. El público NO tiene acceso directo:
-- usa las funciones de abajo, que devuelven únicamente lo autorizado.
drop policy if exists "equipo administra enlaces" on public.enlaces_compartidos;
create policy "equipo administra enlaces" on public.enlaces_compartidos
  for all to authenticated using (true) with check (true);

-- Ficha pública de un enlace: solo campos comerciales autorizados.
-- Nunca devuelve id, clave, sección, mapa ni fechas internas.
create or replace function public.ficha_compartida(p_codigo text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'titulo',           p.titulo,
    'operacion',        p.operacion,
    'categoria',        p.categoria,
    'descripcion',      p.descripcion,
    'precio_visible',   e.mostrar_precio,
    'precio',           case when e.mostrar_precio then p.precio end,
    'precio_desde',     case when e.mostrar_precio then p.precio_desde else false end,
    'forma_pago',       case when e.mostrar_precio then p.forma_pago else '' end,
    'colonia',          case when e.mostrar_ubicacion then p.colonia else '' end,
    'municipio',        case when e.mostrar_ubicacion then p.municipio else '' end,
    'estado',           case when e.mostrar_ubicacion then p.estado else '' end,
    'terreno_m2',       p.terreno_m2,
    'construccion_m2',  p.construccion_m2,
    'recamaras',        p.recamaras,
    'banos',            p.banos,
    'estacionamientos', p.estacionamientos,
    'huespedes',        p.huespedes,
    'extras',           p.extras,
    'fotos',            p.fotos,
    'video',            p.video,
    'nota',             e.nota_adicional
  )
  from public.enlaces_compartidos e
  join public.publicaciones p on p.id = e.publicacion_id
  where e.codigo = p_codigo
    and e.activo
    and (e.vence_en is null or e.vence_en > now())
    and p.publicada
    and p.eliminada_en is null;
$$;

-- Código del enlace que las aliadas pueden compartir desde la página pública (o null).
create or replace function public.enlace_para_aliadas(p_publicacion text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select e.codigo
  from public.enlaces_compartidos e
  join public.publicaciones p on p.id = e.publicacion_id
  where e.publicacion_id = p_publicacion
    and e.activo
    and e.permitir_aliadas
    and (e.vence_en is null or e.vence_en > now())
    and p.publicada
    and p.eliminada_en is null;
$$;

-- ---------- Permisos de la API ----------
-- El proyecto no da acceso automático a tablas nuevas: aquí se da solo lo necesario.
-- (Las políticas RLS de arriba siguen filtrando qué filas ve cada quien.)
grant usage on schema public to anon, authenticated;
grant select on public.publicaciones to anon;
grant select, insert, update, delete on public.publicaciones to authenticated;
grant select, insert, update, delete on public.enlaces_compartidos to authenticated;
-- anon NO recibe permisos sobre enlaces_compartidos: solo usa las dos funciones.

revoke all on function public.ficha_compartida(text) from public;
revoke all on function public.enlace_para_aliadas(text) from public;
grant execute on function public.ficha_compartida(text) to anon, authenticated;
grant execute on function public.enlace_para_aliadas(text) to anon, authenticated;

-- ---------- 4. Publicaciones de ejemplo ----------
insert into public.publicaciones
  (id, clave, seccion, operacion, categoria, titulo, municipio, estado, precio, precio_desde,
   recamaras, banos, estacionamientos, construccion_m2, terreno_m2, extras, fotos, destacada,
   creada_en, actualizada_en)
values
  ('los-volcanes', 'ALB-001', 'albavera', 'Venta', 'Departamento', 'Departamentos modernos con alberca',
   'Los Volcanes', 'Morelos', 3050000, true, 3, null, 2, 110, null, '{"Alberca"}', '{"/images/departamentos.jpg"}', true,
   '2026-10-01', '2026-10-01'),
  ('casa-residencial', 'ALB-002', 'albavera', 'Venta', 'Casa', 'Casa residencial de diseño moderno',
   '', 'Morelos', null, false, 4, 3.5, 2, null, null, '{}', '{"/images/residencia.jpg"}', true,
   '2026-10-01', '2026-10-01'),
  ('huitzilac', 'ALB-003', 'albavera', 'Venta', 'Terreno', 'Terreno rodeado de naturaleza',
   'Huitzilac', 'Morelos', 550000, false, null, null, null, null, 402, '{"Entorno natural"}', '{"/images/huitzilac.jpg"}', true,
   '2026-10-01', '2026-10-01')
on conflict (id) do nothing;
