"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Bath, BedDouble, Car, MapPin, Maximize2, Search, Trees } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { propiedadesDestacadas, whatsappUrl, type Caracteristica, type Division, type Propiedad } from "@/lib/site";

type Listing = { id: string; title: string; category: string; price: string; location: string; image: string; active: boolean };
const CLAVE_ADMIN = "comalba-listings-v1";
const TIPOS = ["Casa", "Departamento", "Terreno", "Bodega"];

const ICONOS: Record<Caracteristica["icono"], typeof BedDouble> = {
  area: Maximize2,
  recamaras: BedDouble,
  banos: Bath,
  autos: Car,
  naturaleza: Trees,
};

const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* Portada con buscador estilo portal + listado de propiedades en venta */
export function AlbaveraExplorador({ division }: { division: Division }) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(propiedadesDestacadas);
  const [tipo, setTipo] = useState("");
  const [zona, setZona] = useState("");
  const [filtro, setFiltro] = useState({ tipo: "", zona: "" });

  /* Suma las publicaciones activas del panel de administración */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE_ADMIN);
      if (!raw) return;
      const extras = (JSON.parse(raw) as Listing[])
        .filter((x) => x.active && TIPOS.includes(x.category))
        .map<Propiedad>((x) => ({
          id: x.id,
          titulo: x.title,
          ubicacion: x.location || "Ubicación a consultar",
          precio: x.price || "Consultar precio",
          operacion: "Venta",
          tipo: x.category,
          imagen: x.image,
          caracteristicas: [],
        }));
      if (extras.length) setPropiedades([...propiedadesDestacadas, ...extras]);
    } catch {
      /* Datos locales dañados: se muestran solo las destacadas */
    }
  }, []);

  const visibles = useMemo(
    () =>
      propiedades.filter(
        (p) =>
          (!filtro.tipo || p.tipo === filtro.tipo) &&
          (!filtro.zona || normalizar(`${p.ubicacion} ${p.titulo}`).includes(normalizar(filtro.zona))),
      ),
    [propiedades, filtro],
  );

  const conteo = (t: string) => propiedades.filter((p) => !t || p.tipo === t).length;

  const buscar = (e: FormEvent) => {
    e.preventDefault();
    setFiltro({ tipo, zona: zona.trim() });
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const elegirTipo = (t: string) => {
    setTipo(t);
    setFiltro((f) => ({ ...f, tipo: t }));
  };

  const mensajeAsesor = `Hola, busco ${filtro.tipo ? `${filtro.tipo.toLowerCase()} ` : "una propiedad "}en venta${filtro.zona ? ` en ${filtro.zona}` : ""}. ¿Me pueden enviar opciones?`;

  return (
    <>
      {/* Portada: la búsqueda es lo primero */}
      <section className="relative isolate overflow-hidden text-white">
        <Image src="/images/hero-departamentos.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-marino-950/70" />

        <div className="mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-end px-6 pb-14 pt-36 sm:px-10 lg:pb-20">
          <MarcaDivision division={division} className="h-24 w-40 shadow-xl shadow-black/30 sm:h-28 sm:w-48" />
          <h1 className="fade-up mt-8 max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            Casas, departamentos y terrenos en venta en Morelos.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-8 text-white/80">
            Busca entre las propiedades que publicamos o pide a un asesor que te envíe opciones a tu medida.
          </p>

          <div className="fade-up mt-10 [animation-delay:.15s]">
            {/* Operaciones del grupo, como en un portal: cada una lleva a su división */}
            <div className="flex gap-1 text-sm font-bold">
              <span aria-current="page" className="rounded-t-xl bg-white px-5 py-3 text-marino-900">Comprar</span>
              <Link href="/civ-rentas" className="rounded-t-xl bg-marino-950/60 px-5 py-3 text-white/80 backdrop-blur transition hover:bg-marino-950/80 hover:text-white">
                Rentar
              </Link>
              <Link href="/#venta" className="rounded-t-xl bg-marino-950/60 px-5 py-3 text-white/80 backdrop-blur transition hover:bg-marino-950/80 hover:text-white">
                Vender
              </Link>
            </div>
            <form
              onSubmit={buscar}
              role="search"
              className="grid gap-2 rounded-b-2xl rounded-tr-2xl bg-white p-2 text-marino-900 shadow-2xl shadow-black/40 md:grid-cols-[1fr_1.4fr_auto]"
            >
              <label className="flex flex-col rounded-xl px-4 py-2.5 focus-within:bg-marfil">
                <span className="text-xs font-semibold text-piedra">Tipo de inmueble</span>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-0.5 bg-transparent text-[15px] font-semibold outline-none">
                  <option value="">Todos</option>
                  {TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col rounded-xl px-4 py-2.5 focus-within:bg-marfil md:border-l md:border-marino-950/10">
                <span className="text-xs font-semibold text-piedra">Zona o colonia</span>
                <input
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Ej. Cuernavaca, Huitzilac"
                  className="mt-0.5 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-piedra/70"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-marino-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-marino-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dorado-500"
              >
                <Search size={18} /> Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section id="resultados" className="scroll-mt-24 bg-marfil px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 border-b border-marino-950/10 pb-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-4xl font-semibold text-marino-900 sm:text-5xl">
                {visibles.length} {visibles.length === 1 ? "propiedad" : "propiedades"} en venta
              </h2>
              {filtro.zona && <p className="mt-2 text-sm text-piedra">Resultados para “{filtro.zona}”</p>}
            </div>
            <div role="group" aria-label="Filtrar por tipo" className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
              {["", ...TIPOS].map((t) => (
                <button
                  key={t || "todas"}
                  type="button"
                  aria-pressed={filtro.tipo === t}
                  onClick={() => elegirTipo(t)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    filtro.tipo === t
                      ? "border-marino-900 bg-marino-900 text-white"
                      : "border-marino-950/15 bg-white text-marino-900 hover:border-marino-900"
                  }`}
                >
                  {t || "Todas"} <span className="opacity-60">{conteo(t)}</span>
                </button>
              ))}
            </div>
          </div>

          {visibles.length > 0 ? (
            <ul className="mt-8 space-y-5">
              {visibles.map((p) => (
                <li key={p.id}>
                  <article className="grid overflow-hidden rounded-2xl bg-white ring-1 ring-marino-950/8 sm:grid-cols-[minmax(0,320px)_1fr]">
                    <div className="relative aspect-[4/3] bg-crema sm:aspect-auto sm:min-h-56">
                      {p.imagen && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imagen} alt={p.titulo} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      )}
                      <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-marino-900">{p.tipo}</span>
                    </div>
                    <div className="flex flex-col p-6 sm:p-7">
                      <p className="font-hero text-3xl font-semibold text-marino-900">{p.precio}</p>
                      <h3 className="mt-2 text-lg font-bold leading-snug text-tinta">{p.titulo}</h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-piedra">
                        <MapPin size={15} className="shrink-0" /> {p.ubicacion}
                      </p>
                      {p.caracteristicas.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-marino-900">
                          {p.caracteristicas.map((c) => {
                            const Icono = ICONOS[c.icono];
                            return (
                              <li key={c.texto} className="flex items-center gap-1.5">
                                <Icono size={17} strokeWidth={1.7} className="text-dorado-600" /> {c.texto}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-marino-950/10 pt-5 sm:mt-auto">
                        <a
                          href={whatsappUrl(`Hola, me interesa la propiedad "${p.titulo}" (${p.ubicacion}). ¿Sigue disponible?`, division.telefono)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
                        >
                          <WhatsAppIcon className="size-4" /> Preguntar por esta propiedad
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-marino-950/20 bg-white p-10 text-center">
              <p className="font-display text-2xl font-semibold text-marino-900">No hay publicaciones con esos filtros.</p>
              <p className="mt-2 text-sm text-piedra">Prueba con otro tipo o zona, o pide a un asesor opciones que aún no publicamos.</p>
            </div>
          )}

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-marino-900 p-7 text-white sm:flex-row sm:items-center sm:p-8">
            <p className="max-w-lg text-[15px] leading-7 text-white/80">
              Tenemos más inmuebles de los que publicamos. Cuéntanos qué buscas y te enviamos opciones.
            </p>
            <a
              href={whatsappUrl(mensajeAsesor, division.telefono)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-dorado-500 px-6 py-3 text-sm font-bold text-marino-950 transition hover:bg-dorado-400"
            >
              <WhatsAppIcon className="size-4" /> Pedir opciones a un asesor
            </a>
          </div>
          <p className="mt-4 text-xs text-piedra">Precios aproximados y sujetos a cambios. Confirma disponibilidad con un asesor.</p>
        </div>
      </section>
    </>
  );
}
