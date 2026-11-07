"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Phone } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { divisiones, formatearTelefono } from "@/lib/site";

/* Cada necesidad lleva a la división que la resuelve (algunas divisiones atienden más de una) */
const NECESIDADES = [
  { texto: "Buscas un inmueble en venta, o solo requieres asesoría", slug: "albavera", href: "/albavera", detalle: "Busca entre las propiedades en venta o pide opciones a un asesor." },
  { texto: "Distintas opciones en arrendamiento (desde un departamento, hasta una nave industrial)", slug: "civ-rentas", href: "/civ-rentas#anual", detalle: "Rentas anuales para comercio, industria y vivienda." },
  { texto: "Rentar una casa para vacacionar", slug: "civ-rentas", href: "/civ-rentas#vacacional", detalle: "Casas y departamentos por noche, fin de semana o temporada." },
  { texto: "¿El banco no te presta?, ¿te gustaría comprar cualquier inmueble con financiamiento?", slug: "financiamiento", href: "/financiamiento", detalle: "Hasta 10 años de plazo, tasa preferencial de 4% anual." },
  { texto: "Una cocina integral o un clóset a la medida", slug: "aqmen", href: "/aqmen", detalle: "Elige la distribución en un plano y agenda tu visita de medición." },
  { texto: "¿Necesitas mudarte, o solo transladar articulos a otro lado?", slug: "immor", href: "/immor", detalle: "Cotiza tu mudanza o flete en tres pasos." },
  { texto: "Mantenimiento y proyección", slug: "asesoria-proyectos", href: "/asesoria-proyectos", detalle: "Asesoría jurídica, gestoría, mantenimiento y proyectos." },
];

function Panel({ i, className = "" }: { i: number; className?: string }) {
  const necesidad = NECESIDADES[i];
  const division = divisiones.find((d) => d.slug === necesidad.slug)!;

  return (
    <div className={`flex-col rounded-3xl bg-marino-900 p-5 text-white sm:p-9 ${className}`}>
      <MarcaDivision key={division.slug} division={division} className="fade-up h-[4.5rem] w-32 self-start sm:h-28 sm:w-48" />
      <p className="mt-4 text-sm font-semibold text-arena-300 sm:mt-7">{division.etiqueta}</p>
      <h3 className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-4xl">{division.nombre}</h3>
      <p className="mt-2 text-cuerpo text-white/75 sm:mt-3">{necesidad.detalle}</p>
      {division.telefono && (
        <a href={`tel:+52${division.telefono}`} className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 sm:mt-6 transition hover:text-white">
          <Phone size={16} /> {formatearTelefono(division.telefono)}
        </a>
      )}
      <Link
        href={necesidad.href}
        className="mt-5 inline-flex w-fit items-center rounded-full bg-dorado-500 px-6 py-3 text-sm sm:mt-8 sm:px-7 sm:py-3.5 font-bold text-marino-950 transition hover:bg-dorado-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arena-200"
      >
        Ir a {division.nombre}
      </Link>
    </div>
  );
}

/* Escritorio: lista a la izquierda y panel a la derecha, sin desplazarse dentro de la sección. Celular: el panel se abre bajo la opción elegida.
   La opción cambia solo al hacer clic/tocar o con las flechas del teclado (no al pasar el mouse). */
export function DivisionesSelector() {
  const [i, setI] = useState(0);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const elegidaPorUsuario = useRef(false);

  // En celular, al cerrarse el panel de arriba la lista se recorre: mantener visible la opción elegida
  useEffect(() => {
    if (!elegidaPorUsuario.current || !window.matchMedia("(max-width: 1023px)").matches) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    botones.current[i]?.scrollIntoView({ block: "nearest", behavior: reducir ? "auto" : "smooth" });
  }, [i]);

  const elegir = (idx: number, enfocar = false) => {
    elegidaPorUsuario.current = true;
    setI(idx);
    if (enfocar) botones.current[idx]?.focus();
  };

  // Teclado de un grupo de opciones: flechas para moverse, Inicio/Fin para los extremos
  const alPresionarTecla = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = NECESIDADES.length;
    const destino =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (idx + 1) % total
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (idx - 1 + total) % total
      : e.key === "Home" ? 0
      : e.key === "End" ? total - 1
      : null;
    if (destino === null) return;
    e.preventDefault();
    elegir(destino, true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <div role="radiogroup" aria-label="¿Qué necesitas?" className="border-t-2 border-marino-900">
        {NECESIDADES.map((n, idx) => {
          const activo = idx === i;
          return (
            <div key={n.texto} className="border-b border-marino-950/12">
              <button
                ref={(el) => { botones.current[idx] = el; }}
                type="button"
                role="radio"
                aria-checked={activo}
                tabIndex={activo ? 0 : -1}
                onClick={() => elegir(idx)}
                onKeyDown={(e) => alPresionarTecla(e, idx)}
                className={`group flex w-full scroll-mt-28 items-center justify-between gap-4 py-3 text-left font-display text-xl font-medium leading-snug sm:py-4 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dorado-600 sm:text-[1.75rem] ${
                  activo ? "text-marino-900" : "cursor-pointer text-piedra hover:text-marino-700"
                }`}
              >
                {n.texto}
                <span
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 rounded-full bg-dorado-500 transition ${activo ? "scale-100" : "scale-0 group-hover:scale-75 group-hover:opacity-50"}`}
                />
              </button>
              {activo && <Panel i={idx} className="mb-4 flex sm:mb-5 lg:hidden" />}
            </div>
          );
        })}
      </div>

      <div aria-live="polite" className="hidden lg:block">
        <Panel i={i} className="flex" />
      </div>
    </div>
  );
}
