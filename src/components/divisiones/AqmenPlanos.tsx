"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappUrl, type Division } from "@/lib/site";

/* Cada distribución es un plano visto desde arriba: [x, y, ancho, alto] de los muebles */
type Mueble = [number, number, number, number];
type Distribucion = { id: string; nombre: string; texto: string; muebles: Mueble[] };

const LINEAS: Record<"cocinas" | "closets", { nombre: string; singular: string; distribuciones: Distribucion[] }> = {
  cocinas: {
    nombre: "Cocinas integrales",
    singular: "cocina",
    distribuciones: [
      { id: "lineal", nombre: "Lineal", texto: "Todo en una pared. Ideal para departamentos y espacios angostos.", muebles: [[10, 10, 100, 18]] },
      { id: "l", nombre: "En L", texto: "Aprovecha una esquina y deja libre el centro para una mesa.", muebles: [[10, 10, 100, 18], [10, 28, 18, 52]] },
      { id: "u", nombre: "En U", texto: "Tres frentes de trabajo y la mayor capacidad de guardado.", muebles: [[10, 10, 100, 18], [10, 28, 18, 52], [92, 28, 18, 52]] },
      { id: "paralela", nombre: "Paralela", texto: "Dos frentes enfrentados, muy eficiente para cocinar.", muebles: [[10, 10, 100, 18], [10, 62, 100, 18]] },
      { id: "isla", nombre: "Con isla", texto: "Una barra central para cocinar, servir y convivir.", muebles: [[10, 10, 100, 18], [32, 48, 56, 20]] },
    ],
  },
  closets: {
    nombre: "Clósets y vestidores",
    singular: "clóset",
    distribuciones: [
      { id: "empotrado", nombre: "Empotrado", texto: "Un frente de puertas a muro, sin perder espacio en la recámara.", muebles: [[10, 10, 100, 14]] },
      { id: "vestidor-l", nombre: "Vestidor en L", texto: "Colgado largo y entrepaños en dos muros.", muebles: [[10, 10, 100, 14], [10, 24, 14, 56]] },
      { id: "vestidor-u", nombre: "Vestidor en U", texto: "Un cuarto completo para ropa, calzado y accesorios.", muebles: [[10, 10, 100, 14], [10, 24, 14, 56], [96, 24, 14, 56]] },
    ],
  },
};

function Plano({ muebles, grande = false }: { muebles: Mueble[]; grande?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" className="h-full w-full">
      {grande && (
        <pattern id="reticula" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="currentColor" strokeOpacity=".08" strokeWidth=".4" />
        </pattern>
      )}
      {grande && <rect x="6" y="6" width="108" height="88" fill="url(#reticula)" />}
      {/* Muros con el hueco de la puerta abajo */}
      <path d="M44 94H6V6H114V94H76" fill="none" stroke="currentColor" strokeWidth={grande ? 2.4 : 3.5} strokeLinecap="square" />
      {grande && <path d="M76 94A32 32 0 0 0 44 62" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth=".6" strokeDasharray="2 2" />}
      {muebles.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="1" className="fill-dorado-500/85 transition-all duration-500" stroke="currentColor" strokeWidth={grande ? 0.6 : 1} />
      ))}
    </svg>
  );
}

/* Configurador: el cliente elige la distribución en un plano y la manda tal cual a un asesor */
export function AqmenPlanos({ division }: { division: Division }) {
  const [linea, setLinea] = useState<"cocinas" | "closets">("cocinas");
  const [id, setId] = useState("l");
  const [metros, setMetros] = useState(4);

  const datos = LINEAS[linea];
  const elegida = datos.distribuciones.find((d) => d.id === id) ?? datos.distribuciones[0];

  const cambiarLinea = (l: "cocinas" | "closets") => {
    setLinea(l);
    setId(LINEAS[l].distribuciones[l === "cocinas" ? 1 : 0].id);
    setMetros(l === "cocinas" ? 4 : 3);
  };

  const mensaje = `Hola AQMEN, me interesa ${datos.singular === "cocina" ? "una cocina" : "un clóset"} con distribución ${elegida.nombre.toLowerCase()} de aproximadamente ${metros} metros lineales. ¿Pueden visitarme para medir?`;

  return (
    <section className="bg-marfil px-6 pb-16 pt-32 sm:px-10 sm:pt-36 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <MarcaDivision division={division} className="h-20 w-44 ring-1 ring-marino-950/10" />
            <h1 className="fade-up mt-8 max-w-2xl text-balance font-display text-5xl font-semibold leading-[1.02] text-marino-900 sm:text-6xl lg:text-7xl">
              Cocinas y clósets hechos a la medida de tu casa.
            </h1>
          </div>
          <p className="max-w-sm text-cuerpo-lg text-piedra">
            Elige la forma de tu espacio en el plano. Con eso preparamos la visita de medición y tu propuesta de diseño.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-3xl bg-white ring-1 ring-marino-950/10 lg:grid-cols-[1.15fr_1fr]">
          {/* Plano grande */}
          <div className="relative border-b border-marino-950/10 p-6 text-marino-900 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="mx-auto aspect-[6/5] max-w-xl">
              <Plano muebles={elegida.muebles} grande />
            </div>
            <p className="mt-4 text-center text-sm text-piedra">
              Vista en planta. {datos.singular === "cocina" ? "Cocina" : "Clóset"} {elegida.nombre.toLowerCase()}, aprox. {metros} m lineales.
            </p>
          </div>

          {/* Opciones */}
          <div className="p-6 sm:p-10">
            <div role="radiogroup" aria-label="Línea de producto" className="grid grid-cols-2 rounded-full bg-marfil p-1 text-sm font-bold">
              {(["cocinas", "closets"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="radio"
                  aria-checked={linea === l}
                  onClick={() => cambiarLinea(l)}
                  className={`rounded-full px-4 py-2.5 transition ${linea === l ? "bg-marino-900 text-white" : "text-marino-900 hover:bg-white"}`}
                >
                  {LINEAS[l].nombre}
                </button>
              ))}
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-marino-900">Distribución</legend>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
                {datos.distribuciones.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    aria-pressed={elegida.id === d.id}
                    onClick={() => setId(d.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                      elegida.id === d.id ? "border-marino-900 bg-marino-900 text-white" : "border-marino-950/15 text-marino-900 hover:border-marino-900"
                    }`}
                  >
                    <span className="block aspect-[6/5] w-full">
                      <Plano muebles={d.muebles} />
                    </span>
                    {d.nombre}
                  </button>
                ))}
              </div>
              <p className="mt-4 min-h-12 text-[15px] leading-6 text-piedra">{elegida.texto}</p>
            </fieldset>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-marino-950/15 p-4">
              <span>
                <span className="block text-sm font-semibold text-marino-900">Metros lineales aproximados</span>
                <span className="block text-xs text-piedra">Lo confirmamos en la visita</span>
              </span>
              <span className="flex items-center gap-3">
                <button type="button" aria-label="Quitar un metro" disabled={metros <= 1} onClick={() => setMetros((m) => m - 1)} className="grid size-10 place-items-center rounded-full border border-marino-950/20 text-marino-900 transition hover:border-marino-900 disabled:opacity-30">
                  <Minus size={16} />
                </button>
                <output aria-live="polite" className="w-8 text-center font-hero text-2xl font-semibold text-marino-900">{metros}</output>
                <button type="button" aria-label="Agregar un metro" disabled={metros >= 15} onClick={() => setMetros((m) => m + 1)} className="grid size-10 place-items-center rounded-full border border-marino-950/20 text-marino-900 transition hover:border-marino-900 disabled:opacity-30">
                  <Plus size={16} />
                </button>
              </span>
            </div>

            <a
              href={whatsappUrl(mensaje, division.telefono)}
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-marino-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-marino-700"
            >
              <WhatsAppIcon className="size-[18px]" /> Agendar visita de medición
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
