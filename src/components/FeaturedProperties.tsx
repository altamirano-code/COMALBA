"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Car, MapPin, Maximize2, Sparkles, Users } from "lucide-react";
import { usePublicacionesPublicas } from "@/lib/almacenPublicaciones";
import { MAX_DESTACADAS, caracteristicasDe, precioTexto, ubicacionTexto, type Caracteristica } from "@/lib/publicaciones";

const ICONOS: Record<Caracteristica["icono"], typeof BedDouble> = {
  area: Maximize2,
  recamaras: BedDouble,
  banos: Bath,
  autos: Car,
  huespedes: Users,
  extra: Sparkles,
};

/* Siempre 4 propiedades en el inicio: primero las destacadas desde /admin, luego las más recientes */
export function FeaturedProperties() {
  const { publicaciones, cargando } = usePublicacionesPublicas();
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(false);
  const pista = useRef<HTMLDivElement>(null);

  const propiedades = useMemo(() => {
    const inmuebles = publicaciones.filter((p) => p.seccion !== "aqmen");
    return [...inmuebles.filter((p) => p.destacada), ...inmuebles.filter((p) => !p.destacada)].slice(0, MAX_DESTACADAS);
  }, [publicaciones]);

  const actualizarFlechas = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuedeIzq(el.scrollLeft > 8);
    setPuedeDer(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    actualizarFlechas();
    const el = pista.current;
    el?.addEventListener("scroll", actualizarFlechas, { passive: true });
    window.addEventListener("resize", actualizarFlechas);
    return () => {
      el?.removeEventListener("scroll", actualizarFlechas);
      window.removeEventListener("resize", actualizarFlechas);
    };
  }, [actualizarFlechas, propiedades]);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={pista} className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-6 pt-2 sm:-mx-10 sm:scroll-px-10 sm:px-10">
        {cargando &&
          [0, 1, 2].map((i) => (
            <div key={i} aria-hidden="true" className="h-[22rem] w-[85%] sm:h-[26rem] shrink-0 animate-pulse rounded-[1.4rem] bg-white/70 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]" />
          ))}
        {propiedades.map((p) => (
          <article
            key={p.id}
            className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-[0_10px_40px_-18px_rgba(16,27,45,.35)] ring-1 ring-marino-950/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(16,27,45,.45)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="relative h-48 overflow-hidden bg-crema sm:h-64">
              {p.fotos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.fotos[0]} alt={p.titulo} loading="lazy" className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.07]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-marino-900/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                {p.operacion}
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-marino-900 backdrop-blur">
                {p.categoria}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="font-display text-2xl font-semibold leading-none text-dorado-600 sm:text-[1.75rem]">{precioTexto(p)}</p>
              <h3 className="mt-2 text-base font-bold leading-snug text-tinta sm:mt-3 sm:text-[17px]">{p.titulo}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-piedra">
                <MapPin size={15} className="shrink-0 text-marino-500" /> {ubicacionTexto(p)}
              </p>

              {caracteristicasDe(p).length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-marino-950/10 pt-4 text-[13px] sm:pt-5 font-medium text-piedra [margin-top:max(1.25rem,auto)]">
                  {caracteristicasDe(p).map((c) => {
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
        ))}
      </div>

      {/* Flechas (solo aparecen si hay más tarjetas de las que caben) */}
      {(puedeIzq || puedeDer) && (
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => mover(-1)}
            disabled={!puedeIzq}
            aria-label="Propiedades anteriores"
            className="grid size-12 place-items-center rounded-full border border-marino-950/15 bg-white text-marino-900 shadow-sm transition hover:bg-marino-900 hover:text-white disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            disabled={!puedeDer}
            aria-label="Siguientes propiedades"
            className="grid size-12 place-items-center rounded-full border border-marino-950/15 bg-white text-marino-900 shadow-sm transition hover:bg-marino-900 hover:text-white disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
