"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

/* Galería de la ficha (referencia idea_vista/vista.jpeg):
   - Escritorio: mosaico con una foto grande y una cuadrícula de 2x2.
   - Celular: carrusel con swipe y contador.
   - Cualquier foto abre el visor a pantalla completa con todas. */
export function GaleriaMosaico({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [abierta, setAbierta] = useState<number | null>(null);

  if (!fotos.length) return null;
  const visibles = fotos.slice(0, 5);
  const restantes = fotos.length - visibles.length;

  /* Distribución del mosaico según cuántas fotos haya */
  const celda = (i: number) => {
    const total = visibles.length;
    if (i === 0) return total === 1 ? "col-span-4 row-span-2" : total === 2 ? "col-span-2 row-span-2" : "col-span-2 row-span-2";
    if (total === 2) return "col-span-2 row-span-2";
    if (total === 3) return "col-span-2 row-span-1";
    if (total === 4) return i === 3 ? "col-span-2 row-span-1" : "col-span-1 row-span-1";
    return "col-span-1 row-span-1";
  };

  return (
    <>
      {/* Celular: carrusel */}
      <CarruselFotos fotos={fotos} titulo={titulo} onAbrir={setAbierta} />

      {/* Escritorio: mosaico */}
      <div className="relative hidden h-[min(64vh,600px)] grid-cols-4 grid-rows-2 gap-3 md:grid">
        {visibles.map((foto, i) => (
          <button
            key={foto + i}
            type="button"
            onClick={() => setAbierta(i)}
            className={`group relative overflow-hidden rounded-3xl bg-black/5 ${celda(i)}`}
            aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto}
              alt={i === 0 ? titulo : ""}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            />
            {i === visibles.length - 1 && restantes > 0 && (
              <span className="absolute inset-0 grid place-items-center bg-black/45 text-lg font-semibold text-white">+{restantes} fotos</span>
            )}
          </button>
        ))}
        {fotos.length > 1 && (
          <button
            type="button"
            onClick={() => setAbierta(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white"
          >
            <Images size={16} /> Ver las {fotos.length} fotos
          </button>
        )}
      </div>

      {abierta !== null && <Visor fotos={fotos} titulo={titulo} inicial={abierta} onCerrar={() => setAbierta(null)} />}
    </>
  );
}

export function Visor({ fotos, titulo, inicial, onCerrar }: { fotos: string[]; titulo: string; inicial: number; onCerrar: () => void }) {
  const [i, setI] = useState(inicial);
  const toque = useRef<number | null>(null);
  const ir = useCallback((dir: number) => setI((x) => (x + dir + fotos.length) % fotos.length), [fotos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    document.addEventListener("keydown", onKey);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = antes;
    };
  }, [ir, onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${titulo}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white"
      onTouchStart={(e) => (toque.current = e.touches[0]!.clientX)}
      onTouchEnd={(e) => {
        if (toque.current === null) return;
        const delta = e.changedTouches[0]!.clientX - toque.current;
        if (Math.abs(delta) > 50) ir(delta < 0 ? 1 : -1);
        toque.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm font-semibold tabular-nums text-white/80">
          {i + 1} / {fotos.length}
        </span>
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fotos[i]} alt={`${titulo}, foto ${i + 1}`} className="max-h-full max-w-full rounded-xl object-contain" />
        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:grid"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:grid"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* Carrusel del celular: swipe entre fotos con contador. Se oculta desde md. */
export function CarruselFotos({ fotos, titulo, onAbrir, redondeo = "rounded-3xl" }: { fotos: string[]; titulo: string; onAbrir: (i: number) => void; redondeo?: string }) {
  const [actual, setActual] = useState(0);
  const carrusel = useRef<HTMLDivElement>(null);

  function alDeslizar() {
    const el = carrusel.current;
    if (el) setActual(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative md:hidden">
      <div
        ref={carrusel}
        onScroll={alDeslizar}
        className={`flex snap-x snap-mandatory overflow-x-auto ${redondeo} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {fotos.map((foto, i) => (
          <button key={foto + i} type="button" onClick={() => onAbrir(i)} className="aspect-[4/3] w-full shrink-0 snap-center" aria-label={`Ver foto ${i + 1} de ${fotos.length}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt={i === 0 ? titulo : ""} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur">
        {actual + 1}/{fotos.length}
      </span>
    </div>
  );
}
