"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { slidesInicio } from "@/lib/site";

const DURACION = 7000;

/* Imágenes de fondo del inicio que cambian solas con un acercamiento lento */
export function HeroSlideshow() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setTimeout(() => setActual((i) => (i + 1) % slidesInicio.length), DURACION);
    return () => clearTimeout(t);
  }, [actual, pausado]);

  /* Pausa el cambio de imagen cuando la pestaña no está visible */
  useEffect(() => {
    const onVis = () => setPausado(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const slide = slidesInicio[actual];

  return (
    <>
      {/* Imágenes */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden bg-marino-950">
        {slidesInicio.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${i === actual ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${i === actual ? "ken-burns" : ""}`}
              style={{ objectPosition: s.posicion }}
            />
          </div>
        ))}
      </div>

      {/* Capas para que el texto siempre se lea */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-marino-950/45" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,27,45,.15)_0%,rgba(16,27,45,.65)_75%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-marino-950 via-marino-950/60 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Lugar de la imagen actual + controles */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-7xl items-end justify-between gap-6 pb-8 pl-6 pr-24 sm:pl-10 2xl:pr-10">
        <p key={slide.src} className="fade-up hidden items-center gap-2 text-xs font-medium text-white/75 sm:flex">
          <MapPin size={14} className="text-arena-300" />
          <span className="text-white">{slide.titulo}</span>
          <span className="text-white/40">·</span>
          {slide.lugar}
        </p>

        <div className="ml-auto flex items-center gap-3" role="tablist" aria-label="Imágenes de fondo">
          {slidesInicio.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === actual}
              aria-label={`Ver imagen ${i + 1}: ${s.titulo}`}
              onClick={() => setActual(i)}
              className="group relative h-8 w-10 sm:w-14"
            >
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition group-hover:bg-white/45">
                {i === actual && (
                  <span
                    key={`${actual}-${pausado}`}
                    className="progreso absolute inset-0 bg-arena-300"
                    style={{ ["--duracion" as string]: `${DURACION}ms`, animationPlayState: pausado ? "paused" : "running" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
