"use client";

import { useId, useState } from "react";
import { Hammer, Home, PaintRoller } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappUrl, type Division } from "@/lib/site";

const TASA_ANUAL = 0.04;
const PLAZO_MAXIMO = 10;

const PROPOSITOS = [
  { id: "Compra", verbo: "comprar", texto: "Casa, departamento o terreno", Icono: Home },
  { id: "Construye", verbo: "construir", texto: "En tu propio terreno", Icono: Hammer },
  { id: "Remodela", verbo: "remodelar", texto: "Amplía o renueva tu inmueble", Icono: PaintRoller },
];

const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

/* Pago fijo mensual (amortización francesa) */
const mensualidad = (monto: number, anios: number) => {
  const r = TASA_ANUAL / 12;
  const n = anios * 12;
  return (monto * r) / (1 - Math.pow(1 + r, -n));
};

export function CalculadoraFinanciamiento({ division }: { division: Division }) {
  const [proposito, setProposito] = useState(PROPOSITOS[0]);
  const [monto, setMonto] = useState(1_500_000);
  const [anios, setAnios] = useState(PLAZO_MAXIMO);
  const idMonto = useId();
  const idPlazo = useId();

  const pago = mensualidad(monto, anios);
  const total = pago * anios * 12;

  const mensaje = `Hola, quiero información de financiamiento para ${proposito.verbo}: ${pesos.format(monto)} a ${anios} ${anios === 1 ? "año" : "años"} (mensualidad estimada de ${pesos.format(pago)}).`;

  return (
    <section className="bg-marfil px-6 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-36 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-start gap-8 sm:gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="lg:pt-4">
          <MarcaDivision division={division} className="ring-1 ring-marino-950/10" />
          <h1 className="fade-up mt-5 text-balance sm:mt-8 font-display text-4xl font-semibold leading-[1.02] text-marino-900 sm:text-6xl lg:text-7xl">
            Compra, construye o remodela con un financiamiento a tu alcance.
          </h1>

          <dl className="mt-6 grid grid-cols-3 border-y sm:mt-10 border-marino-950/15">
            {[
              { valor: "10", unidad: "años", etiqueta: "de plazo" },
              { valor: "4%", unidad: "anual", etiqueta: "tasa preferencial" },
              { valor: "Flexible", unidad: "", etiqueta: "comprobación de ingresos" },
            ].map((d, i) => (
              <div key={d.etiqueta} className={`flex flex-col py-3 sm:py-5 ${i > 0 ? "border-l border-marino-950/15 pl-4 sm:pl-6" : "pr-4"}`}>
                <dt className="order-2 mt-1 text-xs leading-5 text-piedra sm:text-sm">{d.etiqueta}</dt>
                <dd className="font-hero text-2xl font-semibold text-marino-900 sm:text-4xl">
                  {d.valor} {d.unidad && <span className="text-base font-medium text-piedra sm:text-lg">{d.unidad}</span>}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 max-w-md text-cuerpo sm:mt-8 text-piedra">
            Calcula tu mensualidad aproximada. Un asesor revisa tu caso y te explica los requisitos para integrar tu expediente.
          </p>
        </div>

        {/* Calculadora */}
        <div className="rounded-3xl bg-marino-900 p-5 text-white shadow-2xl shadow-marino-950/30 sm:p-9">
          <div role="radiogroup" aria-label="¿Para qué es el financiamiento?" className="grid grid-cols-3 gap-2">
            {PROPOSITOS.map((p) => {
              const activo = proposito.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => setProposito(p)}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition sm:p-4 ${
                    activo ? "border-arena-300 bg-arena-300 text-marino-950" : "border-white/15 text-white hover:border-white/40"
                  }`}
                >
                  <p.Icono size={22} strokeWidth={1.6} />
                  <span className="font-bold">{p.id}</span>
                  <span className={`hidden text-xs leading-4 sm:block ${activo ? "text-marino-900/75" : "text-white/55"}`}>{p.texto}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 sm:mt-9">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={idMonto} className="text-sm font-semibold text-white/80">Monto a financiar</label>
              <span className="font-hero text-2xl font-semibold">{pesos.format(monto)}</span>
            </div>
            <input
              id={idMonto}
              type="range"
              min={200_000}
              max={5_000_000}
              step={50_000}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              aria-valuetext={pesos.format(monto)}
              className="rango mt-4 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-white/45">
              <span>$200 mil</span>
              <span>$5 millones</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={idPlazo} className="text-sm font-semibold text-white/80">Plazo</label>
              <span className="font-hero text-2xl font-semibold">
                {anios} {anios === 1 ? "año" : "años"}
              </span>
            </div>
            <input
              id={idPlazo}
              type="range"
              min={1}
              max={PLAZO_MAXIMO}
              step={1}
              value={anios}
              onChange={(e) => setAnios(Number(e.target.value))}
              aria-valuetext={`${anios} años`}
              className="rango mt-4 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-white/45">
              <span>1 año</span>
              <span>10 años</span>
            </div>
          </div>

          <div aria-live="polite" className="mt-6 rounded-2xl bg-white/[0.06] p-4 ring-1 sm:mt-9 sm:p-6 ring-white/10">
            <p className="text-sm text-white/70">Mensualidad estimada</p>
            <p className="mt-1 font-hero text-4xl font-semibold tracking-tight text-arena-200 sm:text-6xl">{pesos.format(pago)}</p>
            <p className="mt-3 text-sm text-white/60">
              Pago total aproximado de {pesos.format(total)} con tasa de 4% anual.
            </p>
          </div>

          <a
            href={whatsappUrl(mensaje, division.telefono)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-dorado-500 px-4 py-3.5 sm:mt-7 sm:px-6 sm:py-4 text-sm font-bold text-marino-950 transition hover:bg-dorado-400"
          >
            <WhatsAppIcon className="size-[18px]" /> Enviar mi simulación a un asesor
          </a>
          <p className="mt-4 text-xs leading-5 text-white/45">
            Cálculo de referencia. El monto, la tasa y las condiciones finales dependen de la evaluación de tu caso.
          </p>
        </div>
      </div>
    </section>
  );
}
