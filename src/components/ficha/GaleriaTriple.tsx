"use client";

import { useState } from "react";
import { CarruselFotos, Visor } from "./GaleriaMosaico";

/* Galería del enlace sin datos (referencia idea_vista/vista2.jpeg):
   foto grande | dos apiladas | una alta con la barra «Ver todas las fotos».
   En el celular es un carrusel. Cualquier foto abre el visor con todas. */
export function GaleriaTriple({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  if (!fotos.length) return null;

  const n = fotos.length;
  // Índices de cada columna según cuántas fotos haya
  const medio = n >= 4 ? [1, 2] : n === 3 ? [1] : [];
  const derecha = n >= 4 ? 3 : n >= 2 ? n - 1 : null;
  const columnas = derecha === null ? "grid-cols-1" : medio.length ? "grid-cols-[2fr_1fr_1fr]" : "grid-cols-[2fr_1fr]";

  const foto = (i: number, clase = "") => (
    <button key={i} type="button" onClick={() => setAbierta(i)} className={`group relative overflow-hidden rounded-md bg-neutral-100 ${clase}`} aria-label={`Ver foto ${i + 1} de ${n}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fotos[i]}
        alt={i === 0 ? titulo : ""}
        loading={i === 0 ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
      />
    </button>
  );

  return (
    <>
      <CarruselFotos fotos={fotos} titulo={titulo} onAbrir={setAbierta} redondeo="rounded-md" />

      <div className={`hidden h-[min(62vh,560px)] gap-2.5 md:grid ${columnas}`}>
        {foto(0)}
        {medio.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {medio.map((i) => (
              foto(i, "flex-1")
            ))}
          </div>
        )}
        {derecha !== null && (
          <div className="flex flex-col gap-2.5">
            {foto(derecha, "flex-1")}
            <button
              type="button"
              onClick={() => setAbierta(0)}
              className="flex h-12 shrink-0 items-center justify-between rounded-md bg-neutral-900 px-4 text-[0.9375rem] font-medium text-white transition hover:bg-neutral-800"
            >
              Ver todas las fotos <span className="tabular-nums text-white/60">{n}</span>
            </button>
          </div>
        )}
      </div>

      {abierta !== null && <Visor fotos={fotos} titulo={titulo} inicial={abierta} onCerrar={() => setAbierta(null)} />}
    </>
  );
}
