/* Credenciales públicas de Supabase (van en .env.local). La anon key es pública por diseño:
   la seguridad la ponen las políticas RLS de supabase/esquema.sql. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const BUCKET_FOTOS = "fotos";
