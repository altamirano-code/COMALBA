"use client";

/* =========================================================
   SESIÓN DEL EQUIPO (Supabase Auth)
   Los usuarios del panel se crean en Supabase → Authentication → Users
   y se agregan a la tabla "equipo" (supabase/05_equipo.sql). Una cuenta
   que no está en el equipo no entra al panel ni ve datos internos.
   La sesión vive en cookies, así el middleware protege /admin desde el servidor.
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

/* Tener cuenta no basta: debe estar en la tabla "equipo" (supabase/05_equipo.sql) */
async function esEquipo(): Promise<boolean> {
  const { data, error } = await supabaseNavegador().rpc("es_equipo");
  return !error && data === true;
}

/* Usuario del equipo con sesión iniciada, o null (sin sesión o con una cuenta que no es del equipo) */
export async function leerSesion(): Promise<UsuarioEquipo | null> {
  if (!supabaseConfigurado) return null;
  const { data } = await supabaseNavegador().auth.getSession();
  if (!data.session || !(await esEquipo())) return null;
  return aUsuario(data.session.user);
}

export const MENSAJE_SIN_ACCESO = "Esta cuenta no tiene acceso al panel. Pide a un administrador que te agregue al equipo.";

/* Devuelve un mensaje de error para mostrar, o null si entró */
export async function iniciarSesion(correo: string, contrasena: string): Promise<string | null> {
  if (!supabaseConfigurado) return "El panel todavía no está conectado a Supabase.";
  const supabase = supabaseNavegador();
  const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: contrasena });
  if (error) {
    return error.message.includes("Invalid login") ? "Correo o contraseña incorrectos." : "No se pudo iniciar sesión. Intenta de nuevo.";
  }
  if (!(await esEquipo())) {
    await supabase.auth.signOut();
    return MENSAJE_SIN_ACCESO;
  }
  return null;
}

export async function cerrarSesion() {
  if (!supabaseConfigurado) return;
  await supabaseNavegador().auth.signOut();
}

/* Avisa cuando se inicia o cierra sesión (en esta pestaña y en otras) */
export function alCambiarSesion(fn: (usuario: UsuarioEquipo | null) => void) {
  if (!supabaseConfigurado) return () => {};
  let activo = true;
  const { data } = supabaseNavegador().auth.onAuthStateChange((_evento, sesion) => {
    if (!sesion) return fn(null);
    // Consultar Supabase dentro de este aviso puede trabarlo: se hace justo después
    setTimeout(() => {
      esEquipo().then((ok) => activo && fn(ok ? aUsuario(sesion.user) : null));
    }, 0);
  });
  return () => {
    activo = false;
    data.subscription.unsubscribe();
  };
}
