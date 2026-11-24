import {
  Car,
  Dumbbell,
  MapPin,
  Mountain,
  PawPrint,
  PlayCircle,
  ShieldCheck,
  Sofa,
  Sparkles,
  Sun,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { DatosFicha } from "@/lib/ficha";
import { GaleriaTriple } from "./GaleriaTriple";
import { BotonCompartir } from "./BotonCompartir";

/* =========================================================
   FICHA DEL ENLACE SIN DATOS (referencia idea_vista/vista2.jpeg)
   Página blanca y limpia: galería, compartir y ubicación,
   precio grande a la izquierda; cifras, amenidades,
   descripción y ficha técnica a la derecha.
   Sin formularios, logotipos ni datos de ninguna inmobiliaria.
   ========================================================= */

/* Ícono de cada amenidad según el texto capturado en el panel */
const ICONOS: [RegExp, LucideIcon][] = [
  [/alberca|piscina|lago|mar\b|playa|r[ií]o/i, Waves],
  [/vista|monta|volc[aá]n|cerro/i, Mountain],
  [/jard[ií]n|[aá]rbol|bosque|naturaleza|[aá]rea verde/i, Trees],
  [/seguridad|vigilancia|caseta|privada|acceso controlado/i, ShieldCheck],
  [/estacionamiento|cochera|garage|garaje/i, Car],
  [/gimnasio|gym/i, Dumbbell],
  [/terraza|roof|asador|solar/i, Sun],
  [/mascota/i, PawPrint],
  [/amueblad/i, Sofa],
];
const iconoDe = (texto: string) => ICONOS.find(([patron]) => patron.test(texto))?.[1] ?? Sparkles;

export function FichaSinDatos({ ficha }: { ficha: DatosFicha }) {
  return (
    <article className="mx-auto max-w-[1180px]">
      <GaleriaTriple fotos={ficha.fotos} titulo={ficha.titulo} />

      {/* Compartir y ubicación, alineados con las columnas de la galería */}
      <div className="mt-3 flex items-center justify-between gap-4 md:grid md:grid-cols-[2fr_2fr] md:gap-2.5">
        <BotonCompartir titulo={ficha.titulo} />
        {ficha.ubicacion && (
          <p className="flex min-w-0 items-center gap-1.5 text-sm text-neutral-700">
            <MapPin size={15} className="shrink-0" />
            <span className="truncate">{ficha.ubicacion}</span>
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[2fr_2fr] md:gap-2.5">
        {/* Izquierda: precio */}
        <div className="md:sticky md:top-8 md:self-start md:pr-10">
          <p className="text-sm text-neutral-500">{ficha.etiqueta === ficha.categoria ? ficha.categoria : `${ficha.categoria} en ${ficha.etiqueta.toLowerCase()}`}</p>
          <h1 className="mt-1 text-xl font-semibold leading-snug text-neutral-950 sm:text-2xl">{ficha.titulo}</h1>
          <p className="mt-6 font-display text-[clamp(2.5rem,1.8rem+2.8vw,3.5rem)] font-semibold leading-none tracking-tight text-neutral-950">{ficha.precio}</p>
          {ficha.formaPago && ficha.precio !== "$$$" && <p className="mt-3 text-[0.9375rem] text-neutral-600">{ficha.formaPago}</p>}
        </div>

        {/* Derecha: cifras, amenidades, descripción y ficha técnica */}
        <div className="min-w-0">
          {ficha.cifras.length > 0 && (
            <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
              {ficha.cifras.map((c) => (
                <li key={c.unidad} className="flex items-baseline gap-1.5">
                  <span className="font-display text-[clamp(2.25rem,1.8rem+1.6vw,2.75rem)] font-semibold leading-none tracking-tight text-neutral-950">{c.valor}</span>
                  <span className="text-[0.9375rem] text-neutral-700">{c.unidad}</span>
                </li>
              ))}
            </ul>
          )}
          {ficha.especificaciones.length > 0 && (
            <a href="#ficha-tecnica" className="mt-4 inline-block text-[0.9375rem] font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-[6px] transition hover:decoration-neutral-900">
              Ver ficha técnica completa
            </a>
          )}

          {ficha.extras.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
              {ficha.extras.map((x) => {
                const Icono = iconoDe(x);
                return (
                  <li key={x} className="flex items-center gap-2 text-[0.9375rem] text-neutral-800">
                    <Icono size={19} strokeWidth={1.6} className="shrink-0" /> {x}
                  </li>
                );
              })}
            </ul>
          )}

          {ficha.descripcion && <p className="mt-8 whitespace-pre-line text-[0.9375rem] leading-7 text-neutral-700">{ficha.descripcion}</p>}

          {ficha.nota && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-neutral-950">Información adicional</h2>
              <p className="mt-2 whitespace-pre-line text-[0.9375rem] leading-7 text-neutral-700">{ficha.nota}</p>
            </section>
          )}

          {ficha.video && (
            <a
              href={ficha.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-[6px] hover:decoration-neutral-900"
            >
              <PlayCircle size={19} strokeWidth={1.6} /> Ver video de la propiedad
            </a>
          )}

          {ficha.especificaciones.length > 0 && (
            <section id="ficha-tecnica" className="mt-12 scroll-mt-8">
              <h2 className="text-lg font-semibold text-neutral-950">Ficha técnica</h2>
              <dl className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
                {ficha.especificaciones.map((e) => (
                  <div key={e.etiqueta} className="flex justify-between gap-6 py-3 text-[0.9375rem]">
                    <dt className="text-neutral-500">{e.etiqueta}</dt>
                    <dd className="text-right font-medium text-neutral-900">{e.valor}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
