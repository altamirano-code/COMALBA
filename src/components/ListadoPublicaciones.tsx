"use client";

import { usePublicacionesPublicas } from "@/lib/almacenPublicaciones";
import type { Operacion, Seccion } from "@/lib/publicaciones";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";

/* Catálogo de una sección (y opcionalmente de una sola operación), con las mismas
   tarjetas de «Propiedades destacadas». Cada tarjeta abre la página de la propiedad. */
export function ListadoPublicaciones({ seccion, operacion }: { seccion: Seccion; operacion?: Operacion }) {
  const { publicaciones, cargando } = usePublicacionesPublicas();
  const visibles = publicaciones.filter((p) => p.seccion === seccion && (!operacion || p.operacion === operacion));

  if (cargando) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[22rem] animate-pulse rounded-[1.4rem] bg-white/70 sm:h-[26rem]" />
        ))}
      </div>
    );
  }

  if (!visibles.length) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-marino-950/20 bg-white p-6 text-center sm:p-10">
        <p className="font-medium text-marino-900">Estamos preparando el catálogo.</p>
        <p className="mt-2 text-sm text-piedra">Contáctanos para conocer las opciones disponibles.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibles.map((p) => (
        <li key={p.id} className="flex">
          <TarjetaPropiedad p={p} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
