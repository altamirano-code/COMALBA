"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Factory, Home, Minus, Plus, Store, Sun } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { ListadoPublicaciones } from "@/components/ListadoPublicaciones";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappUrl, type Division } from "@/lib/site";

type Modo = "anual" | "vacacional";

const SEGMENTOS = [
  {
    id: "Comercio",
    icono: Store,
    espacios: ["Local comercial", "Oficina", "Consultorio", "Terreno"],
    texto: "Espacios a pie de calle o en plaza para abrir o mudar tu negocio.",
  },
  {
    id: "Industria",
    icono: Factory,
    espacios: ["Bodega", "Nave industrial", "Terreno para patio de maniobras"],
    texto: "Almacenamiento y operación con acceso para carga y descarga.",
  },
  {
    id: "Vivienda",
    icono: Home,
    espacios: ["Casa", "Departamento"],
    texto: "Un hogar para vivir todo el año, con contrato y reglas claras.",
  },
];

const hoy = () => new Date().toISOString().slice(0, 10);
const noches = (a: string, b: string) => {
  if (!a || !b) return 0;
  const n = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
  return n > 0 ? n : 0;
};

/* Dos formas de rentar con CIV: por año (comercio, industria, vivienda) o por temporada (vivienda) */
export function RentasCiv({ division }: { division: Division }) {
  const [modo, setModo] = useState<Modo>("anual");

  // Permite llegar directo a una modalidad desde el inicio: /civ-rentas#vacacional
  useEffect(() => {
    if (window.location.hash === "#vacacional") setModo("vacacional");
  }, []);

  const cambiar = (m: Modo) => {
    setModo(m);
    history.replaceState(null, "", m === "vacacional" ? "#vacacional" : "#anual");
  };

  return (
    <>
      <section className="relative bg-marino-950 pt-28 text-white sm:pt-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col justify-between gap-4 sm:gap-8 lg:flex-row lg:items-end">
            <div>
              <MarcaDivision division={division} className="h-[4.5rem] w-28 sm:h-28 sm:w-40" />
              <h1 className="fade-up mt-5 max-w-2xl sm:mt-8 text-balance font-display text-4xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
                Renta por año o por temporada.
              </h1>
            </div>
            <p className="max-w-sm text-cuerpo-lg text-white/75">
              Elige cómo quieres rentar. Te mostramos los espacios disponibles y un asesor de CIV te acompaña hasta la firma o la llegada.
            </p>
          </div>

          {/* Las dos puertas */}
          <div role="tablist" aria-label="Tipo de renta" className="mt-7 grid grid-cols-2 gap-2 sm:mt-12 sm:gap-3">
            {(
              [
                { id: "anual", titulo: "Rentas anuales", detalle: "Comercio, industria y vivienda", imagen: "/images/departamentos.jpg", Icono: CalendarDays },
                { id: "vacacional", titulo: "Rentas vacacionales", detalle: "Casas y departamentos por noche o semana", imagen: "/images/cuernavaca.jpg", Icono: Sun },
              ] as const
            ).map(({ id, titulo, detalle, imagen, Icono }) => {
              const activo = modo === id;
              return (
                <button
                  key={id}
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={activo}
                  aria-controls={`panel-${id}`}
                  onClick={() => cambiar(id)}
                  className={`group relative isolate flex min-h-36 flex-col justify-end overflow-hidden rounded-t-3xl p-4 text-left transition-all duration-500 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-arena-200 sm:min-h-56 sm:p-8 ${
                    activo ? "bg-marfil text-marino-900" : "text-white"
                  }`}
                >
                  {!activo && (
                    <>
                      <Image src={imagen} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-20 object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75" />
                      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-marino-950 to-marino-950/20" />
                    </>
                  )}
                  <Icono size={26} strokeWidth={1.5} className={activo ? "text-dorado-600" : "text-arena-300"} />
                  <span className="mt-2 font-display text-xl font-semibold leading-tight sm:mt-4 sm:text-4xl">{titulo}</span>
                  <span className={`mt-1 text-xs font-semibold sm:text-sm ${activo ? "text-piedra" : "text-white/75"}`}>{detalle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="bg-marfil">
        <div role="tabpanel" id={`panel-${modo}`} aria-labelledby={`tab-${modo}`} className="mx-auto max-w-7xl px-6 py-8 sm:px-10 sm:py-14 lg:py-20">
          {modo === "anual" ? <PanelAnual division={division} /> : <PanelVacacional division={division} />}
        </div>
      </div>
    </>
  );
}

function PanelAnual({ division }: { division: Division }) {
  const [segmento, setSegmento] = useState(SEGMENTOS[2].id);
  const [espacio, setEspacio] = useState("");
  const [zona, setZona] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const actual = SEGMENTOS.find((s) => s.id === segmento)!;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const partes = [
      `Hola, busco una renta anual de ${segmento.toLowerCase()}`,
      espacio && `(${espacio.toLowerCase()})`,
      zona && `en ${zona}`,
      presupuesto && `con presupuesto de ${presupuesto} al mes`,
    ].filter(Boolean);
    window.open(whatsappUrl(`${partes.join(" ")}.`, division.telefono), "_blank", "noopener");
  };

  return (
    <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 className="font-display text-3xl font-semibold text-marino-900 sm:text-4xl">¿Para qué necesitas el espacio?</h2>
        <div className="mt-5 divide-y divide-marino-950/10 sm:mt-8 border-y border-marino-950/10">
          {SEGMENTOS.map(({ id, icono: Icono, espacios, texto }) => {
            const activo = segmento === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={activo}
                onClick={() => {
                  setSegmento(id);
                  setEspacio("");
                }}
                className={`grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 py-4 text-left sm:gap-x-5 sm:py-6 transition sm:grid-cols-[auto_1fr_auto] ${activo ? "" : "opacity-60 hover:opacity-100"}`}
              >
                <span className={`row-span-2 grid size-11 place-items-center rounded-xl transition sm:size-14 sm:rounded-2xl ${activo ? "bg-marino-900 text-arena-200" : "bg-white text-marino-900"}`}>
                  <Icono size={24} strokeWidth={1.5} />
                </span>
                <span className="font-display text-2xl font-semibold text-marino-900 sm:text-3xl">{id}</span>
                <span className="col-start-2 text-cuerpo text-piedra sm:col-span-2">{texto}</span>
                <span className="col-start-2 mt-2 text-sm font-semibold text-marino-700 sm:col-start-3 sm:row-start-1 sm:mt-0 sm:self-center">
                  {espacios.join(", ")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={enviar} className="h-fit rounded-3xl bg-white p-5 ring-1 ring-marino-950/10 sm:p-9">
        <p className="font-display text-2xl font-semibold text-marino-900 sm:text-3xl">Renta anual de {segmento.toLowerCase()}</p>
        <p className="mt-2 text-sm leading-6 text-piedra">Contratos por 12 meses o más, con revisión jurídica de cada documento.</p>

        <fieldset className="mt-5 sm:mt-7">
          <legend className="text-sm font-semibold text-marino-900">Tipo de espacio</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {actual.espacios.map((e) => (
              <button
                key={e}
                type="button"
                aria-pressed={espacio === e}
                onClick={() => setEspacio(espacio === e ? "" : e)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  espacio === e ? "border-marino-900 bg-marino-900 text-white" : "border-marino-950/15 text-marino-900 hover:border-marino-900"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block text-sm font-semibold sm:mt-6 text-marino-900">
          Zona
          <input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Ej. Cuernavaca, Jiutepec" className="mt-2 w-full rounded-xl border border-marino-950/15 bg-marfil px-4 py-3 font-normal outline-none focus:border-marino-900" />
        </label>
        <label className="mt-4 block text-sm font-semibold sm:mt-5 text-marino-900">
          Presupuesto mensual
          <select value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} className="mt-2 w-full rounded-xl border border-marino-950/15 bg-marfil px-4 py-3 font-normal outline-none focus:border-marino-900">
            <option value="">Prefiero comentarlo con el asesor</option>
            <option>hasta $10,000</option>
            <option>$10,000 a $25,000</option>
            <option>$25,000 a $50,000</option>
            <option>más de $50,000</option>
          </select>
        </label>

        <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-marino-900 px-6 py-3.5 sm:mt-8 sm:py-4 text-sm font-bold text-white transition hover:bg-marino-700">
          <WhatsAppIcon className="size-[18px]" /> Enviar mi búsqueda
        </button>
      </form>

      <div className="lg:col-span-2">
        <h3 className="font-display text-2xl font-semibold text-marino-900 sm:text-3xl">Disponibles para renta</h3>
        <div className="mt-4 sm:mt-6">
          <ListadoPublicaciones seccion="civ-rentas" operacion="Renta anual" />
        </div>
      </div>
    </div>
  );
}

function PanelVacacional({ division }: { division: Division }) {
  const [llegada, setLlegada] = useState("");
  const [salida, setSalida] = useState("");
  const [huespedes, setHuespedes] = useState(2);
  const [alojamiento, setAlojamiento] = useState("Casa con alberca");
  const n = noches(llegada, salida);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const fechas = llegada && salida ? ` del ${llegada} al ${salida} (${n} ${n === 1 ? "noche" : "noches"})` : "";
    window.open(
      whatsappUrl(`Hola, busco renta vacacional: ${alojamiento.toLowerCase()} para ${huespedes} ${huespedes === 1 ? "persona" : "personas"}${fechas}. ¿Qué opciones tienen?`, division.telefono),
      "_blank",
      "noopener",
    );
  };

  return (
    <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h2 className="font-display text-3xl font-semibold text-marino-900 sm:text-4xl">Tu descanso en Morelos, listo al llegar.</h2>
        <p className="mt-4 max-w-md text-cuerpo-lg text-piedra">
          Casas y departamentos para fines de semana, puentes o temporadas largas. Dinos tus fechas y te confirmamos disponibilidad.
        </p>
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl sm:mt-10 sm:aspect-[4/3]">
          <Image src="/images/hero-cuernavaca.jpg" alt="Casa con alberca en Cuernavaca" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>

      <form onSubmit={enviar} className="rounded-3xl bg-white p-5 ring-1 ring-marino-950/10 sm:p-9">
        <p className="font-display text-2xl font-semibold text-marino-900 sm:text-3xl">Consulta disponibilidad</p>

        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl sm:mt-7 border border-marino-950/15">
          <label className="block p-3 focus-within:bg-marfil sm:p-4">
            <span className="text-xs font-semibold text-piedra">Llegada</span>
            <input type="date" min={hoy()} value={llegada} onChange={(e) => setLlegada(e.target.value)} className="mt-1 w-full bg-transparent text-[0.9375rem] font-semibold text-marino-900 outline-none" />
          </label>
          <label className="block border-l border-marino-950/15 p-3 focus-within:bg-marfil sm:p-4">
            <span className="text-xs font-semibold text-piedra">Salida</span>
            <input type="date" min={llegada || hoy()} value={salida} onChange={(e) => setSalida(e.target.value)} className="mt-1 w-full bg-transparent text-[0.9375rem] font-semibold text-marino-900 outline-none" />
          </label>
          <div className="col-span-2 flex items-center justify-between border-t border-marino-950/15 p-3 sm:p-4">
            <span>
              <span className="block text-xs font-semibold text-piedra">Huéspedes</span>
              <span className="text-[0.9375rem] font-semibold text-marino-900">
                {huespedes} {huespedes === 1 ? "persona" : "personas"}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <button type="button" aria-label="Quitar un huésped" disabled={huespedes <= 1} onClick={() => setHuespedes((h) => h - 1)} className="grid size-10 place-items-center rounded-full border border-marino-950/20 text-marino-900 transition hover:border-marino-900 disabled:opacity-30">
                <Minus size={16} />
              </button>
              <button type="button" aria-label="Agregar un huésped" disabled={huespedes >= 20} onClick={() => setHuespedes((h) => h + 1)} className="grid size-10 place-items-center rounded-full border border-marino-950/20 text-marino-900 transition hover:border-marino-900 disabled:opacity-30">
                <Plus size={16} />
              </button>
            </span>
          </div>
        </div>

        <fieldset className="mt-4 sm:mt-6">
          <legend className="text-sm font-semibold text-marino-900">Alojamiento</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Casa con alberca", "Casa", "Departamento"].map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={alojamiento === a}
                onClick={() => setAlojamiento(a)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  alojamiento === a ? "border-marino-900 bg-marino-900 text-white" : "border-marino-950/15 text-marino-900 hover:border-marino-900"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <p aria-live="polite" className="mt-4 min-h-6 text-sm sm:mt-7 font-semibold text-dorado-600">
          {n > 0 && `${n} ${n === 1 ? "noche" : "noches"} de estancia`}
        </p>
        <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-marino-900 px-6 py-3.5 sm:py-4 text-sm font-bold text-white transition hover:bg-marino-700">
          <WhatsAppIcon className="size-[18px]" /> Consultar disponibilidad
        </button>
      </form>

      <div className="lg:col-span-2">
        <h3 className="font-display text-2xl font-semibold text-marino-900 sm:text-3xl">Disponibles para vacacionar</h3>
        <div className="mt-4 sm:mt-6">
          <ListadoPublicaciones seccion="civ-rentas" operacion="Renta vacacional" />
        </div>
      </div>
    </div>
  );
}
