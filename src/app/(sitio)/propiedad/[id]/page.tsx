import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, Check, ChevronRight, Maximize2, PlayCircle, Ruler, Users, type LucideIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GaleriaMosaico } from "@/components/ficha/GaleriaMosaico";
import { BotonesCompartir } from "@/components/ficha/BotonesCompartir";
import { BotonRegresar } from "@/components/ficha/BotonRegresar";
import { SolicitarVisita } from "@/components/ficha/SolicitarVisita";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { fichaDesdePublicacion } from "@/lib/ficha";
import { deFila, type FilaPublicacion } from "@/lib/filaPublicacion";
import { publicacionesIniciales, type Publicacion, type Seccion } from "@/lib/publicaciones";
import { divisiones, whatsappUrl } from "@/lib/site";
import { supabasePublico } from "@/lib/supabase/servidor";
import { supabaseConfigurado } from "@/lib/supabase/config";

/* =========================================================
   FICHA DE PROPIEDAD (sitio con marca)
   Se abre desde cualquier tarjeta del catálogo.
   La ficha sin datos (/p/[codigo]) es otra página, sin marca.
   - Arriba: «Regresar» (vuelve a donde estabas en el catálogo) y la ruta
     Inicio › ALBAVERA › Casas › Título en texto pequeño.
   - Colores de la marca y la clave visible.
   - Computadora: precio y formulario en la columna derecha.
   - Celular: barra fija abajo con WhatsApp | Solicitar información.
   ========================================================= */

export const dynamic = "force-dynamic";

/* Catálogo de cada sección: destino de la ruta y de «Regresar» si abrieron la ficha directo */
const CATALOGO: Record<Seccion, string> = {
  albavera: "/albavera#resultados",
  "civ-rentas": "/civ-rentas#catalogo",
  aqmen: "/aqmen#proyectos",
};

/* cache: la metadata y la página comparten la misma consulta */
const cargar = cache(async (id: string): Promise<{ publicacion: Publicacion; codigoSinDatos: string | null } | null> => {
  if (!supabaseConfigurado) {
    const publicacion = publicacionesIniciales.find((p) => p.id === id);
    return publicacion ? { publicacion, codigoSinDatos: null } : null;
  }
  const supabase = supabasePublico();
  const [{ data }, { data: codigo }] = await Promise.all([
    supabase.from("publicaciones").select("*").eq("id", id).maybeSingle(),
    supabase.rpc("enlace_para_aliadas", { p_publicacion: id }),
  ]);
  if (!data) return null;
  const publicacion = deFila(data as FilaPublicacion);
  if (!publicacion.publicada || publicacion.eliminadaEn) return null;
  return { publicacion, codigoSinDatos: (codigo as string | null) ?? null };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const datos = await cargar((await params).id);
  if (!datos) return { title: "Propiedad no disponible | Grupo Comalba" };
  const { publicacion: p } = datos;
  return {
    title: `${p.titulo} | Grupo Comalba`,
    description: p.descripcion.slice(0, 160) || undefined,
    openGraph: { title: p.titulo, images: p.fotos[0] ? [p.fotos[0]] : undefined },
  };
}

const PLURAL: Record<string, string> = {
  Casa: "Casas",
  Departamento: "Departamentos",
  Terreno: "Terrenos",
  Comercial: "Comerciales",
  Industrial: "Industriales",
  "Cocina integral": "Cocinas integrales",
  Clóset: "Clósets",
  "Cocina y clóset": "Cocinas y clósets",
};

const decimal = (v: number) => v.toLocaleString("es-MX");

/* Datos principales con ícono */
function cifras(p: Publicacion): { icono: LucideIcon; valor: string; etiqueta: string }[] {
  const lista: { icono: LucideIcon; valor: string; etiqueta: string }[] = [];
  if (p.recamaras) lista.push({ icono: BedDouble, valor: decimal(p.recamaras), etiqueta: p.recamaras === 1 ? "Recámara" : "Recámaras" });
  if (p.banos) lista.push({ icono: Bath, valor: decimal(p.banos), etiqueta: p.banos === 1 ? "Baño" : "Baños" });
  if (p.construccionM2) lista.push({ icono: Maximize2, valor: `${decimal(p.construccionM2)} m²`, etiqueta: "Construcción" });
  if (p.terrenoM2) lista.push({ icono: Ruler, valor: `${decimal(p.terrenoM2)} m²`, etiqueta: "Terreno" });
  if (p.estacionamientos) lista.push({ icono: Car, valor: decimal(p.estacionamientos), etiqueta: p.estacionamientos === 1 ? "Estacionamiento" : "Estacionamientos" });
  if (p.huespedes) lista.push({ icono: Users, valor: decimal(p.huespedes), etiqueta: "Huéspedes" });
  return lista;
}

const tarjeta = "rounded-xl bg-white p-6 ring-1 ring-marino-950/10 sm:p-7";
const tituloSeccion = "font-display text-xl font-semibold text-marino-900";

export default async function PropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const datos = await cargar((await params).id);
  if (!datos) notFound();
  const { publicacion: p, codigoSinDatos } = datos;
  const ficha = fichaDesdePublicacion(p);
  const division = divisiones.find((d) => d.slug === p.seccion);
  const whatsapp = whatsappUrl(`Hola, me interesa la propiedad ${p.clave} "${p.titulo}". ¿Me dan más información?`, division?.telefono);
  const lista = cifras(p);
  const operacion = p.operacion === "Proyecto" ? "Proyecto a la medida" : p.operacion;

  return (
    <>
      <Navbar />
      {/* pb extra en celular para que la barra fija no tape el final */}
      <main className="min-h-screen bg-marfil px-4 pb-28 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Regresar (vuelve a donde estabas; si abrieron la ficha directo, al catálogo de su sección) + ruta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <BotonRegresar alternativa={CATALOGO[p.seccion]} />
            <nav aria-label="Ruta" className="min-w-0 text-sm text-piedra">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-marino-900 hover:underline">Inicio</Link>
                </li>
                <ChevronRight aria-hidden size={14} className="text-piedra/60" />
                <li>
                  <Link href={CATALOGO[p.seccion]} className="hover:text-marino-900 hover:underline">{division?.nombreCorto ?? "Catálogo"}</Link>
                </li>
                <ChevronRight aria-hidden size={14} className="text-piedra/60" />
                <li>{PLURAL[p.categoria] ?? p.categoria}</li>
                <ChevronRight aria-hidden size={14} className="text-piedra/60" />
                <li aria-current="page" className="max-w-[16rem] truncate font-semibold text-marino-900 sm:max-w-md">{p.titulo}</li>
              </ol>
            </nav>
          </div>

          {/* Encabezado */}
          <header className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-marino-900 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white">{operacion}</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-marino-900 ring-1 ring-marino-950/10">{p.categoria}</span>
              {p.clave && <span className="rounded-md bg-dorado-500/15 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-dorado-600">Clave {p.clave}</span>}
            </div>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-semibold leading-tight text-marino-900">{p.titulo}</h1>
            {ficha.ubicacion && <p className="mt-1.5 text-cuerpo-lg text-piedra">{ficha.ubicacion}</p>}
          </header>

          <div className="mt-6">
            <GaleriaMosaico fotos={ficha.fotos} titulo={ficha.titulo} />
          </div>

          <div className="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            {/* Contenido */}
            <div className="min-w-0 space-y-6">
              {/* Precio en celular (en computadora va en la columna fija) */}
              <section className={`${tarjeta} lg:hidden`}>
                <p className="text-sm font-semibold text-piedra">{operacion}</p>
                <p className="mt-1 font-display text-[2rem] font-semibold leading-none text-marino-900">{ficha.precio}</p>
                {ficha.formaPago && <p className="mt-2 text-sm text-piedra">Forma de pago: {ficha.formaPago}</p>}
              </section>

              {lista.length > 0 && (
                <section className={tarjeta}>
                  <h2 className={tituloSeccion}>Datos principales</h2>
                  <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                    {lista.map(({ icono: Icono, valor, etiqueta }) => (
                      <li key={etiqueta} className="flex items-center gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-marfil text-dorado-600">
                          <Icono size={20} strokeWidth={1.7} />
                        </span>
                        <span>
                          <span className="block text-lg font-semibold leading-tight text-marino-900">{valor}</span>
                          <span className="block text-sm text-piedra">{etiqueta}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section id="acerca" className={`${tarjeta} scroll-mt-32`}>
                <h2 className={tituloSeccion}>Acerca de la propiedad</h2>
                <p className={`mt-3 whitespace-pre-line text-cuerpo ${p.descripcion ? "text-tinta/80" : "text-piedra"}`}>
                  {p.descripcion || "Solicita información para conocer todos los detalles de esta propiedad."}
                </p>
                {ficha.video && (
                  <a href={ficha.video} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-marino-900 underline underline-offset-4">
                    <PlayCircle size={18} /> Ver video de la propiedad
                  </a>
                )}
              </section>

              {ficha.extras.length > 0 && (
                <section className={tarjeta}>
                  <h2 className={tituloSeccion}>Características</h2>
                  <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {ficha.extras.map((x) => (
                      <li key={x} className="flex items-center gap-2.5 text-cuerpo text-tinta/80">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-dorado-500/15 text-dorado-600">
                          <Check size={14} strokeWidth={2.5} />
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {ficha.especificaciones.length > 0 && (
                <section className={tarjeta}>
                  <h2 className={tituloSeccion}>Ficha técnica</h2>
                  <dl className="mt-3 divide-y divide-marino-950/10">
                    {p.clave && (
                      <div className="flex justify-between gap-6 py-3 text-cuerpo">
                        <dt className="text-piedra">Clave</dt>
                        <dd className="font-semibold text-marino-900">{p.clave}</dd>
                      </div>
                    )}
                    {ficha.especificaciones.map((e) => (
                      <div key={e.etiqueta} className="flex justify-between gap-6 py-3 text-cuerpo">
                        <dt className="text-piedra">{e.etiqueta}</dt>
                        <dd className="text-right font-semibold text-marino-900">{e.valor}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* Compartir: compacta, sin espacio de más debajo de los botones */}
              <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-6 py-5 ring-1 ring-marino-950/10 sm:px-7">
                <h2 className={tituloSeccion}>Compartir</h2>
                <BotonesCompartir titulo={p.titulo} codigoSinDatos={codigoSinDatos} />
              </section>
            </div>

            {/* Columna derecha en computadora: precio y formulario en una sola tarjeta. Se desplaza con la página
                (sin quedarse pegada bajo el menú). El formulario trae su propia tarjeta: aquí se le quita el fondo y el margen para integrarlo. */}
            <aside
              id="visita"
              className="scroll-mt-32 rounded-xl bg-white ring-1 ring-marino-950/10 [&_form]:bg-transparent [&_form]:p-6 [&_form]:ring-0 [&_form]:backdrop-blur-none [&_form_h2]:font-display [&_form_h2]:text-[1.75rem] [&_form_h2]:font-semibold [&_form_h2]:text-marino-900"
            >
              <section className="hidden border-b border-marino-950/10 px-6 pb-5 pt-6 lg:block">
                <p className="text-sm font-semibold text-piedra">{operacion}</p>
                <p className="mt-1 font-display text-[2.125rem] font-semibold leading-none tracking-tight text-marino-900">{ficha.precio}</p>
                {ficha.formaPago && <p className="mt-2 text-sm text-piedra">Forma de pago: {ficha.formaPago}</p>}
              </section>
              <SolicitarVisita publicacionId={p.id} />
            </aside>
          </div>
        </div>
      </main>

      {/* Barra fija en celular. z-50: por encima del botón flotante "Panel" del equipo */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-marino-950/10 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_-15px_rgba(16,27,45,.35)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-[2fr_3fr] gap-3">
          <a href={whatsapp} target="_blank" rel="noreferrer" className="boton boton-secundario px-3">
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
          <a href="#visita" className="boton boton-principal whitespace-nowrap px-3">
            Solicitar información
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}
