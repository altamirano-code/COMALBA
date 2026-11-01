"use client";

import { Bath, BedDouble, Car, MapPin, Maximize2, Sparkles, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { usePublicacionesPublicas } from "@/lib/almacenPublicaciones";
import { caracteristicasDe, precioTexto, ubicacionTexto, type Caracteristica, type Operacion, type Seccion } from "@/lib/publicaciones";
import { divisiones, whatsappUrl } from "@/lib/site";

const ICONOS: Record<Caracteristica["icono"], typeof BedDouble> = {
  area: Maximize2,
  recamaras: BedDouble,
  banos: Bath,
  autos: Car,
  huespedes: Users,
  extra: Sparkles,
};

/* Tarjetas de las publicaciones de una sección (y opcionalmente de una sola operación) */
export function ListadoPublicaciones({ seccion, operacion }: { seccion: Seccion; operacion?: Operacion }) {
  const { publicaciones, cargando } = usePublicacionesPublicas();
  const telefono = divisiones.find((d) => d.slug === seccion)?.telefono;
  const visibles = publicaciones.filter((p) => p.seccion === seccion && (!operacion || p.operacion === operacion));

  if (cargando) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-white/70" />
        ))}
      </div>
    );
  }

  if (!visibles.length) {
    return (
      <div className="rounded-2xl border border-dashed border-marino-950/20 bg-white p-10 text-center">
        <p className="font-medium text-marino-900">Estamos preparando el catálogo.</p>
        <p className="mt-2 text-sm text-piedra">Contáctanos para conocer las opciones disponibles.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visibles.map((p) => (
        <li key={p.id}>
          <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-marino-950/8">
            <div className="relative aspect-[4/3] bg-crema">
              {p.fotos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.fotos[0]} alt={p.titulo} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-marino-900">{p.categoria}</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              {p.seccion !== "aqmen" && <p className="font-hero text-2xl font-semibold text-marino-900">{precioTexto(p)}</p>}
              <h3 className="mt-1.5 font-bold leading-snug text-tinta">{p.titulo}</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-piedra">
                <MapPin size={15} className="shrink-0" /> {ubicacionTexto(p)}
              </p>
              {caracteristicasDe(p).length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-marino-900">
                  {caracteristicasDe(p).map((c) => {
                    const Icono = ICONOS[c.icono];
                    return (
                      <li key={c.texto} className="flex items-center gap-1.5">
                        <Icono size={16} strokeWidth={1.7} className="text-dorado-600" /> {c.texto}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-auto pt-5">
                <a
                  href={whatsappUrl(`Hola, me interesa ${p.clave} "${p.titulo}". ¿Me dan más información?`, telefono)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95"
                >
                  <WhatsAppIcon className="size-4" /> Preguntar
                </a>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
