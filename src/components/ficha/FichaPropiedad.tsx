import type { ReactNode } from "react";
import { Check, House, MapPin, PlayCircle } from "lucide-react";
import type { DatosFicha } from "@/lib/ficha";
import { GaleriaMosaico } from "./GaleriaMosaico";
import { BotonCopiarLink } from "./BotonCopiarLink";
import { EnlaceSeccion } from "./EnlaceSeccion";

/* =========================================================
   FICHA DE PROPIEDAD (referencia idea_vista/vista.jpeg)
   Mosaico de fotos (visor con todas), tarjeta de precio con
   píldora, línea de datos, "Acerca de la propiedad",
   información adicional y características. "lateral" es la
   columna derecha (formulario de visita). "acciones" va bajo
   la tarjeta de precio. "izquierda" reemplaza el título de la
   barra superior (p. ej. el enlace para volver al catálogo).
   Todo va dentro de un marco tipo página web, como la referencia:
   contenedor redondeado con gradiente y barra superior sin
   logotipos (tipo de propiedad, accesos a secciones y copiar link).
   Solo pinta lo que recibe: no conoce la marca ni datos internos.
   ========================================================= */

const tarjeta = "rounded-3xl bg-white/75 p-6 ring-1 ring-black/[0.06] backdrop-blur-sm sm:p-8";

const pildora = "inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-medium transition";

export function FichaPropiedad({
  ficha,
  lateral,
  acciones,
  izquierda,
}: {
  ficha: DatosFicha;
  lateral?: ReactNode;
  acciones?: ReactNode;
  izquierda?: ReactNode;
}) {
  const secciones = [
    { id: "acerca", texto: "Acerca de" },
    ...(ficha.extras.length ? [{ id: "caracteristicas", texto: "Características" }] : []),
  ];

  return (
    <div
      className={`${fondoMarco} mx-auto max-w-[88rem] space-y-4 rounded-[1.75rem] p-3 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.05] sm:space-y-6 sm:rounded-[2.25rem] sm:p-5 lg:p-6`}
    >
      {/* Barra superior, como el encabezado de la referencia (sin logotipos ni datos de empresa) */}
      <header className="flex items-center justify-between gap-3 px-1 pt-1 sm:px-2">
        <div className="min-w-0">
          {izquierda ?? (
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white">
                <House size={18} strokeWidth={2} />
              </span>
              <span className="truncate text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">
                {ficha.etiqueta === ficha.categoria ? ficha.categoria : `${ficha.categoria} · ${ficha.etiqueta}`}
              </span>
            </span>
          )}
        </div>

        <nav aria-label="Secciones de la ficha" className="hidden items-center gap-2 md:flex">
          {secciones.map((s) => (
            <EnlaceSeccion key={s.id} id={s.id} className={`${pildora} bg-white/80 text-neutral-800 ring-1 ring-black/[0.05] hover:bg-white`}>
              {s.texto}
            </EnlaceSeccion>
          ))}
          {lateral && (
            <EnlaceSeccion id="visita" className={`${pildora} bg-neutral-950 text-white hover:bg-neutral-800`}>
              Solicitar visita
            </EnlaceSeccion>
          )}
        </nav>

        <BotonCopiarLink />
      </header>

      <div id="fotos" className="scroll-mt-36">
        <GaleriaMosaico fotos={ficha.fotos} titulo={ficha.titulo} />
      </div>

      <div className={`grid items-start gap-5 sm:gap-6 ${lateral ? "lg:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
        <div className="min-w-0 space-y-5 sm:space-y-6">
          {/* Precio y datos clave */}
          <section className={tarjeta}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-display text-[clamp(2rem,1.4rem+2.6vw,2.75rem)] font-bold leading-none tracking-tight text-neutral-950">{ficha.precio}</p>
              <span className="rounded-full bg-emerald-200/80 px-4 py-1.5 text-sm font-semibold text-emerald-950">{ficha.etiqueta}</span>
            </div>
            <h1 className="mt-4 text-lg font-semibold leading-snug text-neutral-900 sm:text-xl">{ficha.titulo}</h1>
            {ficha.datos.length > 0 && (
              <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] text-neutral-600">
                {ficha.datos.map((d, i) => (
                  <li key={d} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden className="size-1 rounded-full bg-neutral-300" />}
                    <span>
                      <strong className="font-semibold text-neutral-900">{d.split(" ")[0]}</strong> {d.split(" ").slice(1).join(" ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {ficha.ubicacion && (
              <p className="mt-3 flex items-start gap-1.5 text-[0.9375rem] text-neutral-600">
                <MapPin size={17} className="mt-0.5 shrink-0 text-neutral-400" /> {ficha.ubicacion}
              </p>
            )}
            {ficha.formaPago && <p className="mt-2 text-sm text-neutral-500">Forma de pago: {ficha.formaPago}</p>}
            {acciones && <div className="mt-6 border-t border-black/[0.06] pt-5">{acciones}</div>}
          </section>

          {/* "About" de la referencia: la descripción que se captura al crear la publicación */}
          <section id="acerca" className={`${tarjeta} scroll-mt-36`}>
            <h2 className="text-xl font-bold text-neutral-950 sm:text-2xl">Acerca de la propiedad</h2>
            <p className={`mt-3 whitespace-pre-line text-[0.9375rem] leading-7 ${ficha.descripcion ? "text-neutral-700" : "text-neutral-500"}`}>
              {ficha.descripcion || "Solicita una visita para conocer todos los detalles de esta propiedad."}
            </p>
          </section>

          {/* Solo en el enlace sin datos: texto extra que Comalba agrega a ese enlace */}
          {ficha.nota && (
            <section className={tarjeta}>
              <h2 className="text-xl font-bold text-neutral-950 sm:text-2xl">Información adicional</h2>
              <p className="mt-3 whitespace-pre-line text-[0.9375rem] leading-7 text-neutral-700">{ficha.nota}</p>
            </section>
          )}

          {ficha.extras.length > 0 && (
            <section id="caracteristicas" className={`${tarjeta} scroll-mt-36`}>
              <h2 className="text-xl font-bold text-neutral-950 sm:text-2xl">Características</h2>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {ficha.extras.map((x) => (
                  <li key={x} className="flex items-center gap-2.5 text-[0.9375rem] text-neutral-700">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ficha.video && (
            <a
              href={ficha.video}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tarjeta} flex items-center gap-3 font-semibold text-neutral-900 transition hover:bg-white`}
            >
              <PlayCircle size={26} className="text-neutral-500" /> Ver video de la propiedad
            </a>
          )}
        </div>

        {lateral && (
          <aside id="visita" className="scroll-mt-36">
            {lateral}
          </aside>
        )}
      </div>
    </div>
  );
}

/* Fondo del marco: claro y liso */
const fondoMarco = "bg-[#f3f2ef]";

/* Fondo de la página detrás del marco (gris claro, como la referencia) */
export const fondoPagina = "bg-[#e6e6e3]";
