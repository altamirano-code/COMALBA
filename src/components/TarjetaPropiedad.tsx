import Link from "next/link";
import { Bath, BedDouble, Car, MapPin, Maximize2, Sparkles, Users } from "lucide-react";
import { caracteristicasDe, precioTexto, ubicacionTexto, type Caracteristica, type Publicacion } from "@/lib/publicaciones";

/* =========================================================
   TARJETA DE PROPIEDAD (diseño único del sitio)
   La usan el inicio (destacadas), ALBAVERA, CIV y AQMEN.
   - Foto 4:3 con la operación y el tipo en las esquinas.
   - Precio grande en marino y la clave a la derecha.
   - Título (máx. 2 líneas), ubicación y los datos clave.
   - Las tarjetas de una fila miden lo mismo: el título tiene
     alto reservado y los datos van siempre al fondo.
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
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-marino-950/10 transition duration-300 hover:shadow-[0_18px_40px_-22px_rgba(16,27,45,.45)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dorado-500 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-crema">
        {p.fotos[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.fotos[0]} alt={p.titulo} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-md bg-marino-900/90 px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
          {p.operacion}
        </span>
        <span className="absolute right-4 top-4 rounded-md bg-white/85 px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-marino-900 backdrop-blur">
          {p.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-[1.625rem] font-semibold leading-none tracking-tight text-marino-900 sm:text-[1.75rem]">
            {esProyecto && p.precio === null ? "Proyecto a la medida" : precioTexto(p)}
          </p>
          {p.clave && <span className="mt-1 shrink-0 text-xs font-semibold tracking-wide text-piedra">{p.clave}</span>}
        </div>

        {/* Alto de 2 líneas reservado: las tarjetas de una fila quedan parejas */}
        <h3 className="mt-3 line-clamp-2 min-h-[2.6em] text-base font-semibold leading-[1.3] text-tinta sm:text-[1.0625rem]">
          <Link href={`/propiedad/${p.id}`} className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none">
            {p.titulo}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-piedra">
          <MapPin size={15} className="shrink-0 text-dorado-600" />
          <span className="truncate">{ubicacionTexto(p)}</span>
        </p>

        {caracteristicas.length > 0 && (
          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-marino-950/10 pt-4 text-[0.8125rem] font-medium text-marino-900 [margin-top:max(1.25rem,auto)] sm:pt-5">
            {caracteristicas.map((c) => {
              const Icono = ICONOS[c.icono];
              return (
                <li key={c.texto} className="flex items-center gap-1.5">
                  <Icono size={16} className="text-dorado-600" strokeWidth={1.7} /> {c.texto}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}
