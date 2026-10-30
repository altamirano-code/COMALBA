"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { divisiones, formatearTelefono } from "@/lib/site";

/* Cada necesidad lleva a la división que la resuelve (algunas divisiones atienden más de una) */
const NECESIDADES = [
  { texto: "Comprar una casa, departamento o terreno", slug: "albavera", href: "/albavera", detalle: "Busca entre las propiedades en venta o pide opciones a un asesor." },
  { texto: "Rentar un local, bodega o vivienda por año", slug: "civ-rentas", href: "/civ-rentas#anual", detalle: "Rentas anuales para comercio, industria y vivienda." },
  { texto: "Rentar una casa para vacacionar", slug: "civ-rentas", href: "/civ-rentas#vacacional", detalle: "Casas y departamentos por noche, fin de semana o temporada." },
  { texto: "Financiar la compra, construcción o remodelación", slug: "financiamiento", href: "/financiamiento", detalle: "Hasta 10 años de plazo, tasa preferencial de 4% anual." },
  { texto: "Una cocina integral o un clóset a la medida", slug: "aqmen", href: "/aqmen", detalle: "Elige la distribución en un plano y agenda tu visita de medición." },
  { texto: "Mudarme o mover muebles", slug: "immor", href: "/immor", detalle: "Cotiza tu mudanza o flete en tres pasos." },
  { texto: "Resolver papeles, trámites, mantenimiento u obra", slug: "asesoria-proyectos", href: "/asesoria-proyectos", detalle: "Asesoría jurídica, gestoría, mantenimiento y proyectos." },
];

function Panel({ i, className = "" }: { i: number; className?: string }) {
  const necesidad = NECESIDADES[i];
  const division = divisiones.find((d) => d.slug === necesidad.slug)!;

  return (
    <div className={`flex-col rounded-3xl bg-marino-900 p-7 text-white sm:p-9 ${className}`}>
      <MarcaDivision key={division.slug} division={division} className="fade-up h-24 w-40 self-start sm:h-28 sm:w-48" />
      <p className="mt-7 text-sm font-semibold text-arena-300">{division.etiqueta}</p>
      <h3 className="mt-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">{division.nombre}</h3>
      <p className="mt-3 text-[15px] leading-7 text-white/75">{necesidad.detalle}</p>
      {division.telefono && (
        <a href={`tel:+52${division.telefono}`} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
          <Phone size={16} /> {formatearTelefono(division.telefono)}
        </a>
      )}
      <Link
        href={necesidad.href}
        className="mt-8 inline-flex w-fit items-center rounded-full bg-dorado-500 px-7 py-3.5 text-sm font-bold text-marino-950 transition hover:bg-dorado-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arena-200"
      >
        Ir a {division.nombre}
      </Link>
    </div>
  );
}

/* Escritorio: lista a la izquierda y panel fijo a la derecha. Celular: el panel se abre bajo la opción elegida. */
export function DivisionesSelector() {
  const [i, setI] = useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <div role="radiogroup" aria-label="¿Qué necesitas?" className="border-t-2 border-marino-900">
        {NECESIDADES.map((n, idx) => {
          const activo = idx === i;
          return (
            <div key={n.texto} className="border-b border-marino-950/12">
              <button
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => setI(idx)}
                onMouseEnter={() => setI(idx)}
                className={`flex w-full items-center justify-between gap-4 py-4 text-left font-display text-2xl font-semibold leading-snug transition sm:text-[1.75rem] ${
                  activo ? "text-marino-900" : "text-marino-900/45 hover:text-marino-900/75"
                }`}
              >
                {n.texto}
                <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full bg-dorado-500 transition ${activo ? "scale-100" : "scale-0"}`} />
              </button>
              {activo && <Panel i={idx} className="mb-5 flex lg:hidden" />}
            </div>
          );
        })}
      </div>

      <div aria-live="polite" className="hidden lg:block">
        <Panel i={i} className="flex lg:sticky lg:top-28" />
      </div>
    </div>
  );
}
