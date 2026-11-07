"use client";

import { useId, useState } from "react";
import { Hammer, Home, PaintRoller } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappUrl, type Division } from "@/lib/site";

const TASA_ANUAL = 0.04;
const PLAZO_ANIOS = 10; // Plazo fijo: no se modifica
const ENGANCHE = 0.333; // Siempre 33.3% sobre el precio
const PRECIO_MIN = 200_000;
const PRECIO_MAX = 5_000_000;

const PROPOSITOS = [
  { id: "Compra", verbo: "comprar", texto: "Casa, departamento o terreno", precio: "Precio del inmueble", Icono: Home },
  { id: "Construye", verbo: "construir", texto: "En tu propio terreno", precio: "Costo de la construcción", Icono: Hammer },
  { id: "Remodela", verbo: "remodelar", texto: "Amplía o renueva tu inmueble", precio: "Costo de la remodelación", Icono: PaintRoller },
];

const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const numero = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
const limitar = (n: number) => Math.min(PRECIO_MAX, Math.max(PRECIO_MIN, n));

/* Pago fijo mensual (amortización francesa) */
const mensualidad = (monto: number, anios: number) => {
  const r = TASA_ANUAL / 12;
  const n = anios * 12;
  return (monto * r) / (1 - Math.pow(1 + r, -n));
};

export function CalculadoraFinanciamiento({ division }: { division: Division }) {
  const [proposito, setProposito] = useState(PROPOSITOS[0]);
  const [precio, setPrecio] = useState(1_500_000);
  const [editando, setEditando] = useState<string | null>(null); // texto mientras se escribe el precio
  const idPrecio = useId();

  const enganche = Math.round(precio * ENGANCHE);
  const financiado = precio - enganche;
  const pago = mensualidad(financiado, PLAZO_ANIOS);
  const total = enganche + pago * PLAZO_ANIOS * 12;

  const mensaje = `Hola, quiero información de financiamiento para ${proposito.verbo}: ${proposito.precio.toLowerCase()} de ${pesos.format(precio)}, enganche de ${pesos.format(enganche)} (33.3%), a ${PLAZO_ANIOS} años (mensualidad estimada de ${pesos.format(pago)}).`;

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
            Calcula tu enganche y tu mensualidad aproximada. Un asesor revisa tu caso y te explica los requisitos para integrar tu expediente.
          </p>
        </div>

        {/* Calculadora */}
        <div className="rounded-3xl bg-marino-900 p-5 text-white shadow-2xl shadow-marino-950/30 sm:p-8">
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
                  className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl border px-1.5 py-3 text-center transition sm:items-start sm:p-4 sm:text-left ${
                    activo ? "border-arena-300 bg-arena-300 text-marino-950" : "border-white/15 text-white hover:border-white/40"
                  }`}
                >
                  <p.Icono size={22} strokeWidth={1.6} />
                  <span className="text-sm font-bold sm:text-base">{p.id}</span>
                  <span className={`hidden text-xs leading-4 sm:block ${activo ? "text-marino-900/75" : "text-white/55"}`}>{p.texto}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 sm:mt-7">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={idPrecio} className="text-sm font-semibold text-white/80">{proposito.precio}</label>
              {/* El precio se puede escribir o mover con la barra */}
              <span className="flex items-baseline border-b border-white/25 font-hero text-2xl font-semibold transition focus-within:border-arena-300">
                <span aria-hidden="true">$</span>
                <input
                  id={idPrecio}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={editando ?? numero.format(precio)}
                  onFocus={(e) => {
                    setEditando(String(precio));
                    e.target.select();
                  }}
                  onChange={(e) => {
                    const digitos = e.target.value.replace(/\D/g, "").slice(0, 9);
                    setEditando(digitos);
                    if (digitos) setPrecio(Math.min(PRECIO_MAX, Number(digitos)));
                  }}
                  onBlur={() => {
                    setPrecio((p) => limitar(p));
                    setEditando(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  className="w-[9.5ch] bg-transparent text-right outline-none"
                />
              </span>
            </div>
            <input
              type="range"
              min={PRECIO_MIN}
              max={PRECIO_MAX}
              step={50_000}
              value={limitar(precio)}
              onChange={(e) => {
                setPrecio(Number(e.target.value));
                setEditando(null);
              }}
              aria-label={proposito.precio}
              aria-valuetext={pesos.format(precio)}
              className="rango mt-4 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-white/45">
              <span>$200 mil</span>
              <span>$5 millones</span>
            </div>
          </div>

          <div aria-live="polite" className="mt-5 overflow-hidden rounded-2xl bg-white/[0.06] ring-1 sm:mt-7 ring-white/10">
            {/* Enganche y plazo lado a lado para no alargar la tarjeta */}
            <dl className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10">
              <div className="p-4 sm:px-6 sm:py-5">
                <dt className="text-sm text-white/70">Enganche (33.3%)</dt>
                <dd className="mt-1 font-hero text-2xl font-semibold tracking-tight sm:text-3xl">{pesos.format(enganche)}</dd>
                <dd className="mt-1 text-xs leading-5 text-white/60 sm:text-sm">Financias {pesos.format(financiado)} a {PLAZO_ANIOS} años.</dd>
              </div>
              <div className="p-4 sm:px-6 sm:py-5">
                <dt className="text-sm text-white/70">Plazo</dt>
                <dd className="mt-1 font-hero text-2xl font-semibold tracking-tight sm:text-3xl">
                  {PLAZO_ANIOS} años <span className="text-sm font-medium text-white/55">fijo</span>
                </dd>
              </div>
            </dl>

            <div className="p-4 sm:px-6 sm:py-5">
              <p className="text-sm text-white/70">Mensualidad estimada</p>
              <p className="mt-1 font-hero text-4xl font-semibold tracking-tight text-arena-200 sm:text-6xl">{pesos.format(pago)}</p>
              <p className="mt-3 text-sm text-white/60">
                Pago total aproximado de {pesos.format(total)}, incluyendo el enganche, con tasa de 4% anual.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl(mensaje, division.telefono)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-dorado-500 px-4 py-3.5 sm:mt-6 sm:px-6 sm:py-4 text-sm font-bold text-marino-950 transition hover:bg-dorado-400"
          >
            <WhatsAppIcon className="size-[18px]" /> Enviar mi simulación a un asesor
          </a>
          <p className="mt-3 text-xs leading-5 text-white/45">
            Cálculo de referencia. El monto, la tasa y las condiciones finales dependen de la evaluación de tu caso.
          </p>
        </div>
      </div>
    </section>
  );
}
