"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Car, MapPin, Maximize2, Trees } from "lucide-react";
import { propiedadesDestacadas, type Caracteristica, type Propiedad } from "@/lib/site";

/* Publicaciones creadas desde /admin (se guardan en el navegador) */
type Listing = { id: string; title: string; category: string; price: string; location: string; image: string; active: boolean };
const CLAVE_ADMIN = "comalba-listings-v1";

const ICONOS: Record<Caracteristica["icono"], typeof BedDouble> = {
  area: Maximize2,
  recamaras: BedDouble,
  banos: Bath,
  autos: Car,
  naturaleza: Trees,
};

export function FeaturedProperties() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(propiedadesDestacadas);
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(false);
  const pista = useRef<HTMLDivElement>(null);

  /* Agrega las publicaciones activas del panel de administración */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE_ADMIN);
      if (!raw) return;
      const extras = (JSON.parse(raw) as Listing[])
        .filter((x) => x.active)
        .map<Propiedad>((x) => ({
          id: x.id,
          titulo: x.title,
          ubicacion: x.location || "Ubicación a consultar",
          precio: x.price || "Consultar precio",
          operacion: "Nuevo",
          tipo: x.category,
          imagen: x.image,
          caracteristicas: [],
        }));
      if (extras.length) setPropiedades([...propiedadesDestacadas, ...extras]);
    } catch {
      /* Datos locales dañados: se muestran solo las destacadas */
    }
  }, []);

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
        {propiedades.map((p) => (
          <article
            key={p.id}
            className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-[0_10px_40px_-18px_rgba(16,27,45,.35)] ring-1 ring-marino-950/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(16,27,45,.45)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="relative h-64 overflow-hidden bg-crema">
              {p.imagen && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen} alt={p.titulo} loading="lazy" className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.07]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-marino-900/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                {p.operacion}
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-marino-900 backdrop-blur">
                {p.tipo}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="font-display text-[1.75rem] font-semibold leading-none text-dorado-600">{p.precio}</p>
              <h3 className="mt-3 text-[17px] font-bold leading-snug text-tinta">{p.titulo}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-piedra">
                <MapPin size={15} className="shrink-0 text-marino-500" /> {p.ubicacion}
              </p>

              {p.caracteristicas.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-marino-950/10 pt-5 text-[13px] font-medium text-piedra [margin-top:max(1.25rem,auto)]">
                  {p.caracteristicas.map((c) => {
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
