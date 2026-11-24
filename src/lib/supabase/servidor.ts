import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/* Cliente anónimo para páginas de servidor públicas: sin sesión ni cookies,
   solo puede leer lo que las políticas RLS permiten al público. */
export function supabasePublico() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}
