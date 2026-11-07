"use client";

import { useEffect } from "react";

/* Al entrar a una página desde un enlace, la deja arriba de golpe.
   Con `scroll-behavior: smooth` en <html>, Next.js sube al inicio con una animación que en
   iPhone (Safari y la app de Google) puede cortarse: la página nueva queda a la altura que
   tenía la anterior, por ejemplo hasta el footer. Con Atrás/Adelante se respeta la posición
   que guarda el navegador. */

let ultimoAtras = 0;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    ultimoAtras = Date.now();
  });
}

export function AlInicioAlEntrar() {
  useEffect(() => {
    if (Date.now() - ultimoAtras < 1000) return;
    // Si el #hash apunta a un elemento real, que el navegador lo muestre (p. ej. /civ-rentas#anual solo elige pestaña)
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && document.getElementById(hash)) return;

    const subir = () => {
      const html = document.documentElement;
      const previo = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previo;
    };
    subir();
    // Una vez más en el siguiente cuadro, por si algo terminó de acomodarse después
    const cuadro = requestAnimationFrame(subir);
    return () => cancelAnimationFrame(cuadro);
  }, []);

  return null;
}
