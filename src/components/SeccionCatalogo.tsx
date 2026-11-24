import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/* Sección propia para un catálogo (CIV, AQMEN), con el mismo encabezado que
   «Propiedades destacadas» del inicio, para que no parezca continuación del bloque anterior. */
export function SeccionCatalogo({
  id,
  etiqueta,
  titulo,
  texto,
  fondo = "bg-white",
  children,
}: {
  id?: string;
  etiqueta: string;
  titulo: string;
  texto: string;
  fondo?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-marino-950/10 px-6 py-16 sm:px-10 sm:py-24 lg:py-28 ${fondo}`}>
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-7 flex flex-col justify-between gap-3 sm:mb-12 sm:gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-dorado-600">{etiqueta}</p>
            <h2 className="mt-3 font-display text-titulo font-semibold text-marino-900 sm:mt-4">{titulo}</h2>
          </div>
          <p className="max-w-sm text-cuerpo-lg text-piedra">{texto}</p>
        </Reveal>
        <Reveal delay={120}>{children}</Reveal>
      </div>
    </section>
  );
}
