import Link from "next/link";
import { Bath, BedDouble, Car, MapPin, Maximize2, Sparkles, Users } from "lucide-react";
import { caracteristicasDe, precioTexto, ubicacionTexto, type Caracteristica, type Publicacion } from "@/lib/publicaciones";

/* =========================================================
   TARJETA DE PROPIEDAD
   El diseño de «Propiedades destacadas» del inicio, compartido
   con los catálogos de CIV (anual y vacacional) y AQMEN.
   Toda la tarjeta abre la página de la propiedad.
   ========================================================= */

const ICONOS: Record<Caracteristica["icono"], typeof BedDouble> = {
  area: Maximize2,
  recamaras: BedDouble,
  banos: Bath,
  autos: Car,
  huespedes: Users,
  extra: Sparkles,
};

export function TarjetaPropiedad({ p, className = "" }: { p: Publicacion; className?: string }) {
  const caracteristicas = caracteristicasDe(p);
  const esProyecto = p.seccion === "aqmen";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-[0_10px_40px_-18px_rgba(16,27,45,.35)] ring-1 ring-marino-950/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(16,27,45,.45)] ${className}`}
    >
      <div className="relative h-48 overflow-hidden bg-crema sm:h-64">
        {p.fotos[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.fotos[0]} alt={p.titulo} loading="lazy" className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.07]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-marino-900/90 px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
          {p.operacion}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-marino-900 backdrop-blur">
          {p.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-display text-2xl font-semibold leading-none text-dorado-600 sm:text-[1.75rem]">
          {esProyecto && p.precio === null ? "Proyecto a la medida" : precioTexto(p)}
        </p>
        <h3 className="mt-2 text-base font-bold leading-snug text-tinta sm:mt-3 sm:text-[1.0625rem]">
          <Link href={`/propiedad/${p.id}`} className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none">
            {p.titulo}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-piedra">
          <MapPin size={15} className="shrink-0 text-marino-500" /> {ubicacionTexto(p)}
        </p>

        {caracteristicas.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-marino-950/10 pt-4 text-[0.8125rem] font-medium text-piedra [margin-top:max(1.25rem,auto)] sm:pt-5">
            {caracteristicas.map((c) => {
              const Icono = ICONOS[c.icono];
              return (
                <li key={c.texto} className="flex items-center gap-1.5">
                  <Icono size={16} className="text-marino-700" strokeWidth={1.7} /> {c.texto}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}
