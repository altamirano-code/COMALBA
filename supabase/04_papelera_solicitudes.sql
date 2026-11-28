-- =========================================================
-- GRUPO COMALBA · Papelera de solicitudes
-- Correr DESPUÉS de 03_leads.sql: SQL Editor → New query → pegar → Run.
-- Se puede volver a correr sin perder datos.
--
-- Eliminar una solicitud desde el panel ya no la borra: la manda a la
-- papelera (eliminada_en con fecha). Desde ahí se restaura o se borra
-- definitivamente, igual que las publicaciones.
-- =========================================================

alter table public.solicitudes add column if not exists eliminada_en timestamptz;
