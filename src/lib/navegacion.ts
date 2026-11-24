"use client";

/* =========================================================
   NAVEGACIÓN «REGRESAR»
   - Cuenta las páginas vistas dentro del sitio desde la última
     carga completa: si hay una anterior, «Regresar» usa el
     historial del navegador (como su flecha de atrás).
   - Detecta cuando se llegó con atrás/adelante (popstate) para
     que los catálogos restauren cómo los dejaste y la altura
     donde estabas.
   ========================================================= */

let visitas = 0;
let volviendo = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    volviendo = true;
  });
}

/* La llama RastreadorNavegacion en cada cambio de página */
export function registrarVisita() {
  visitas++;
  volviendo = false;
}

export const hayPaginaAnterior = () => visitas > 1;

/* Leer al montar un componente (sus efectos corren antes que el del rastreador) */
export const esRegreso = () => volviendo;

/* ---------- Altura de la página al salir a una propiedad ---------- */
const CLAVE_SCROLL = "comalba-scroll:";

export function guardarPosicion() {
  try {
    sessionStorage.setItem(CLAVE_SCROLL + location.pathname, String(Math.round(window.scrollY)));
  } catch {}
}

/* Se llama cuando el catálogo ya cargó, para que la página tenga su altura real */
export function restaurarPosicion() {
  try {
    const clave = CLAVE_SCROLL + location.pathname;
    const y = sessionStorage.getItem(clave);
    if (y === null) return;
    sessionStorage.removeItem(clave);
    setTimeout(() => window.scrollTo({ top: Number(y), behavior: "instant" }), 60);
  } catch {}
}

/* ---------- Estado de un catálogo (vista, página, filtros) ---------- */
export function guardarEstado<T>(clave: string, estado: T) {
  try {
    sessionStorage.setItem(`comalba-estado:${clave}`, JSON.stringify(estado));
  } catch {}
}

export function leerEstado<T>(clave: string): T | null {
  try {
    const valor = sessionStorage.getItem(`comalba-estado:${clave}`);
    return valor ? (JSON.parse(valor) as T) : null;
  } catch {
    return null;
  }
}
