"use client";

/* =========================================================
   SESIÓN DEL EQUIPO (Supabase Auth)
   Los usuarios del panel se crean en Supabase → Authentication → Users
   (no hay registro público). La sesión vive en cookies, así el
   middleware protege /admin desde el servidor.
   ========================================================= */

import type { User } from "@supabase/supabase-js";
import { supabaseNavegador } from "@/lib/supabase/cliente";
import { supabaseConfigurado } from "@/lib/supabase/config";

export type UsuarioEquipo = { nombre: string; rol: string; iniciales: string; correo: string };

function aUsuario(user: User | null | undefined): UsuarioEquipo | null {
  if (!user) return null;
  const correo = user.email ?? "";
  const nombre = (user.user_metadata?.nombre as string | undefined)?.trim() || correo.split("@")[0] || "Equipo";
  const iniciales =
    nombre
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]!.toUpperCase())
      .join("") || "EQ";
  return { nombre, rol: (user.user_metadata?.rol as string | undefined) || "Equipo", iniciales, correo };
}

export async function leerSesion(): Promise<UsuarioEquipo | null> {
  if (!supabaseConfigurado) return null;
  const { data } = await supabaseNavegador().auth.getSession();
  return aUsuario(data.session?.user);
}

/* Devuelve un mensaje de error para mostrar, o null si entró */
export async function iniciarSesion(correo: string, contrasena: string): Promise<string | null> {
  if (!supabaseConfigurado) return "El panel todavía no está conectado a Supabase.";
  const { error } = await supabaseNavegador().auth.signInWithPassword({ email: correo.trim(), password: contrasena });
  if (!error) return null;
  return error.message.includes("Invalid login") ? "Correo o contraseña incorrectos." : "No se pudo iniciar sesión. Intenta de nuevo.";
}

export async function cerrarSesion() {
  if (!supabaseConfigurado) return;
  await supabaseNavegador().auth.signOut();
}

/* Avisa cuando se inicia o cierra sesión (en esta pestaña y en otras) */
export function alCambiarSesion(fn: (usuario: UsuarioEquipo | null) => void) {
  if (!supabaseConfigurado) return () => {};
  const { data } = supabaseNavegador().auth.onAuthStateChange((_evento, sesion) => fn(aUsuario(sesion?.user)));
  return () => data.subscription.unsubscribe();
}
