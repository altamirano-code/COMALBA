"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

let cliente: SupabaseClient | null = null;

/* Cliente del navegador (una sola instancia). La sesión vive en cookies para que el servidor también la lea. */
export function supabaseNavegador() {
  if (!supabaseConfigurado) throw new Error("Falta configurar Supabase en .env.local");
  cliente ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cliente;
}
