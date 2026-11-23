"use client";

/* =========================================================
   SESIÓN DEL EQUIPO (simulada)
   Versión visual: la "sesión" es una marca en este navegador que
   se activa al entrar a /admin y se borra con "Cerrar sesión".
   Al conectar el inicio de sesión real, el servidor decidirá si
   hay sesión y solo se reemplazan estas funciones.
   ========================================================= */

export type UsuarioEquipo = { nombre: string; rol: string; iniciales: string };

const CLAVE = "comalba-sesion";
const EVENTO = "comalba-sesion-cambio";

export const USUARIO_PRUEBA: UsuarioEquipo = { nombre: "Dirección General", rol: "Administrador", iniciales: "DG" };

export function leerSesion(): UsuarioEquipo | null {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor ? (JSON.parse(valor) as UsuarioEquipo) : null;
  } catch {
    return null;
  }
}

export function iniciarSesion(usuario: UsuarioEquipo = USUARIO_PRUEBA) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(usuario));
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

/* Avisa de cambios en esta pestaña y en otras */
export function alCambiarSesion(fn: () => void) {
  const alStorage = (e: StorageEvent) => e.key === CLAVE && fn();
  window.addEventListener(EVENTO, fn);
  window.addEventListener("storage", alStorage);
  return () => {
    window.removeEventListener(EVENTO, fn);
    window.removeEventListener("storage", alStorage);
  };
}
