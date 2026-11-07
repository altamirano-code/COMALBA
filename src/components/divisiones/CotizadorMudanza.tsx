"use client";

import { useState, type FormEvent } from "react";
import { Armchair, Boxes, Building2, ChevronLeft, ChevronRight, Home, Package, Route, Sofa, Truck } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappUrl, type Division } from "@/lib/site";

const SERVICIOS = [
  { id: "Mudanza local", texto: "Dentro de Cuernavaca y zona metropolitana", Icono: Truck },
  { id: "Mudanza foránea", texto: "A otra ciudad o estado", Icono: Route },
  { id: "Flete", texto: "Pocas piezas o mercancía", Icono: Package },
  { id: "Embalaje", texto: "Emplayamos y cargaremos por ti", Icono: Boxes },
];

const TAMANOS = [
  { id: "Algunas piezas", texto: "Un mueble o electrodoméstico", Icono: Armchair },
  { id: "Departamento 1–2 recámaras", texto: "Mudanza chica o mediana", Icono: Sofa },
  { id: "Casa de 3 o más recámaras", texto: "Mudanza completa", Icono: Home },
  { id: "Oficina o local", texto: "Mobiliario y archivo", Icono: Building2 },
];

const hoy = () => new Date().toISOString().slice(0, 10);

/* Cotizador en tres pasos: qué, cuánto y de dónde a dónde. Termina en WhatsApp con todo listo. */
export function CotizadorMudanza({ division }: { division: Division }) {
  const [paso, setPaso] = useState(0);
  const [servicio, setServicio] = useState("");
  const [tamano, setTamano] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");

  const pasos = ["Servicio", "Volumen", "Ruta y fecha"];
  const listoRuta = origen.trim() && destino.trim();

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!listoRuta) return;
    const msg = `Hola IMMOR, quiero cotizar: ${servicio.toLowerCase()} (${tamano.toLowerCase()}) de ${origen.trim()} a ${destino.trim()}${fecha ? ` para el ${fecha}` : ""}.`;
    window.open(whatsappUrl(msg, division.telefono), "_blank", "noopener");
  };

  const opcion = (activo: boolean) =>
    `flex items-center gap-3 rounded-2xl border p-3 text-left sm:gap-4 sm:p-4 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dorado-500 ${
      activo ? "border-marino-900 bg-marino-900 text-white" : "border-marino-950/15 bg-white text-marino-900 hover:border-marino-900"
    }`;

  return (
    <section className="relative overflow-hidden bg-marino-950 px-6 pb-12 pt-28 text-white sm:px-10 sm:pb-16 sm:pt-36 lg:pb-24">
      {/* Trazo de carretera de fondo */}
      <svg aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 w-full text-white/[0.06]">
        <path d="M-20 380C180 360 220 220 400 220S620 60 820 40" fill="none" stroke="currentColor" strokeWidth="46" />
        <path d="M-20 380C180 360 220 220 400 220S620 60 820 40" fill="none" stroke="#d3bd91" strokeOpacity=".35" strokeWidth="2" strokeDasharray="18 16" />
      </svg>

      <div className="relative mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="lg:pt-6">
          <MarcaDivision division={division} className="h-[4.5rem] w-28 sm:h-28 sm:w-44" />
          <h1 className="fade-up mt-5 text-balance sm:mt-8 font-display text-4xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            Cotiza tu mudanza en tres pasos.
          </h1>
          <p className="mt-4 max-w-md text-cuerpo-lg sm:mt-6 text-white/75">
            Salimos desde Cuernavaca, Morelos. Dinos qué llevamos y a dónde, y te respondemos con precio y disponibilidad por WhatsApp.
          </p>
          <ul className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5 sm:mt-10 sm:gap-y-4 text-sm text-white/80">
            {["Mudanzas locales y foráneas", "Fletes desde una pieza", "Embalaje y carga", "Casas, departamentos y oficinas"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-arena-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={enviar} className="rounded-3xl bg-marfil p-4 text-marino-900 shadow-2xl shadow-black/40 sm:p-8">
          {/* Progreso: es un proceso de verdad, por eso va numerado */}
          <ol className="grid grid-cols-3 gap-2">
            {pasos.map((p, i) => {
              const alcanzable = i === 0 || (i === 1 && servicio) || (i === 2 && servicio && tamano);
              return (
                <li key={p}>
                  <button
                    type="button"
                    disabled={!alcanzable}
                    onClick={() => setPaso(i)}
                    aria-current={paso === i ? "step" : undefined}
                    className="w-full text-left disabled:cursor-not-allowed"
                  >
                    <span className={`block h-1 rounded-full transition-colors ${i <= paso ? "bg-dorado-500" : "bg-marino-950/10"}`} />
                    <span className={`mt-2 block text-xs font-bold ${paso === i ? "text-marino-900" : "text-piedra"}`}>
                      {i + 1}. {p}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 min-h-[17rem] sm:mt-7 sm:min-h-[19rem]">
            {paso === 0 && (
              <fieldset>
                <legend className="font-display text-2xl font-semibold sm:text-3xl">¿Qué necesitas?</legend>
                <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                  {SERVICIOS.map(({ id, texto, Icono }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={servicio === id}
                      onClick={() => {
                        setServicio(id);
                        setPaso(1);
                      }}
                      className={opcion(servicio === id)}
                    >
                      <Icono size={26} strokeWidth={1.5} className="shrink-0" />
                      <span>
                        <span className="block font-bold">{id}</span>
                        <span className={`block text-xs ${servicio === id ? "text-white/70" : "text-piedra"}`}>{texto}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {paso === 1 && (
              <fieldset>
                <legend className="font-display text-2xl font-semibold sm:text-3xl">¿Cuánto vamos a mover?</legend>
                <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                  {TAMANOS.map(({ id, texto, Icono }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={tamano === id}
                      onClick={() => {
                        setTamano(id);
                        setPaso(2);
                      }}
                      className={opcion(tamano === id)}
                    >
                      <Icono size={26} strokeWidth={1.5} className="shrink-0" />
                      <span>
                        <span className="block font-bold">{id}</span>
                        <span className={`block text-xs ${tamano === id ? "text-white/70" : "text-piedra"}`}>{texto}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {paso === 2 && (
              <fieldset>
                <legend className="font-display text-2xl font-semibold sm:text-3xl">¿De dónde a dónde?</legend>
                <div className="relative mt-3 rounded-2xl sm:mt-5 border border-marino-950/15 bg-white">
                  {/* Línea de ruta entre origen y destino */}
                  <span aria-hidden="true" className="absolute bottom-[2.6rem] left-[1.55rem] top-[2.6rem] w-0 border-l-2 border-dashed border-dorado-500" />
                  <label className="flex items-center gap-4 p-4">
                    <span aria-hidden="true" className="relative size-3 shrink-0 rounded-full border-2 border-marino-900 bg-white" />
                    <span className="flex-1">
                      <span className="block text-xs font-semibold text-piedra">Origen</span>
                      <input required value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Colonia y ciudad" className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-piedra/70" />
                    </span>
                  </label>
                  <label className="flex items-center gap-4 border-t border-marino-950/10 p-4">
                    <span aria-hidden="true" className="relative size-3 shrink-0 rounded-full bg-marino-900" />
                    <span className="flex-1">
                      <span className="block text-xs font-semibold text-piedra">Destino</span>
                      <input required value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Colonia y ciudad" className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-piedra/70" />
                    </span>
                  </label>
                </div>
                <label className="mt-4 block rounded-2xl border border-marino-950/15 bg-white p-4">
                  <span className="block text-xs font-semibold text-piedra">Fecha tentativa (opcional)</span>
                  <input type="date" min={hoy()} value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full bg-transparent text-[15px] font-semibold outline-none" />
                </label>

                <p className="mt-5 text-sm text-piedra">
                  <span className="font-semibold text-marino-900">{servicio}</span>, {tamano.toLowerCase()}.{" "}
                  <button type="button" onClick={() => setPaso(0)} className="font-semibold text-dorado-600 underline underline-offset-4">
                    Cambiar
                  </button>
                </p>
              </fieldset>
            )}
          </div>

          {paso === 2 ? (
            <button type="submit" disabled={!listoRuta} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-marino-900 px-6 py-3.5 sm:mt-8 sm:py-4 text-sm font-bold text-white transition hover:bg-marino-700 disabled:opacity-40">
              <WhatsAppIcon className="size-[18px]" /> Recibir mi cotización
            </button>
          ) : (
            <>
              <p className="mt-5 text-center text-sm text-piedra sm:mt-0">Elige una opción para continuar.</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-5">
                <button
                  type="button"
                  onClick={() => setPaso((p) => p - 1)}
                  disabled={paso === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-marino-950/20 px-5 py-3.5 text-sm font-bold text-marino-900 transition hover:border-marino-900 disabled:pointer-events-none disabled:opacity-35"
                >
                  <ChevronLeft size={17} /> Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setPaso((p) => p + 1)}
                  disabled={paso === 0 ? !servicio : !tamano}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-marino-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-marino-700 disabled:pointer-events-none disabled:opacity-35"
                >
                  Continuar <ChevronRight size={17} />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
