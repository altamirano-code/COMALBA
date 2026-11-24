"use client";

import type { ReactNode } from "react";

/* Botón de la barra de la ficha que baja a una sección (Acerca de, Solicitar visita…)
   sin agregar #ancla a la URL ni una entrada al historial: así «Regresar» sale de la
   propiedad en lugar de deshacer el salto. */
export function EnlaceSeccion({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        const destino = document.getElementById(id);
        if (!destino) return;
        e.preventDefault();
        destino.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}
