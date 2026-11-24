"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePublicacionesPublicas } from "@/lib/almacenPublicaciones";
import { MAX_DESTACADAS } from "@/lib/publicaciones";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";

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
          <TarjetaPropiedad key={p.id} p={p} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]" />
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
