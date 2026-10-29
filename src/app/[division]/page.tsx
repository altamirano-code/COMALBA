import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PublicListings } from "@/components/PublicListings";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { divisiones, whatsappUrl } from "@/lib/site";

const data = {
  albavera: {
    imagen: "/images/departamentos.jpg",
    eyebrow: "Compra y venta", title: "Encuentra el lugar donde empieza tu siguiente etapa.",
    intro: "Especialistas en venta de inmuebles. Te acompañamos con atención profesional y confiable para encontrar y adquirir la propiedad que se adapte a tus necesidades y objetivos.",
    categories: ["Casa", "Terreno", "Bodega", "Departamento"], cta: "Quiero comprar",
  },
  "civ-rentas": {
    imagen: "/images/residencia.jpg",
    eyebrow: "Renta de propiedades", title: "Un espacio listo para lo que sigue.",
    intro: "Opciones de vivienda y espacios adaptados a tus necesidades, con acompañamiento profesional durante la búsqueda y el proceso de renta.",
    categories: ["Casa", "Departamento", "Bodega"], cta: "Busco rentar",
  },
  "asesoria-proyectos": {
    imagen: "/images/cuernavaca.jpg",
    eyebrow: "Gestión y desarrollo", title: "Resolvemos lo que tu espacio necesita.",
    intro: "Asesoría jurídica, gestoría inmobiliaria, mantenimiento residencial y proyectos de desarrollo para acompañarte antes, durante y después de tu inversión.",
    categories: [], cta: "Solicitar asesoría",
  },
  aqmen: {
    imagen: "/images/residencia.jpg",
    eyebrow: "Diseño a la medida", title: "Diseño funcional, hecho para tu hogar.",
    intro: "Cocinas integrales y clósets con diseños modernos, funcionales y adaptados a cada cliente, para transformar los espacios del hogar.",
    categories: ["Cocina"], cta: "Diseñar mi espacio",
  },
  immor: {
    imagen: "/images/huitzilac-camino.jpg",
    eyebrow: "Fletes y mudanzas", title: "Llegamos contigo a tu nuevo destino.",
    intro: "Mudanzas y transporte para trasladar muebles y pertenencias con soluciones prácticas, seguras y adaptadas a las necesidades de cada cliente.",
    categories: [], cta: "Cotizar servicio",
  },
  financiamiento: {
    imagen: "/images/departamentos.jpg",
    eyebrow: "Opciones para avanzar", title: "Conoce alternativas para tu proyecto.",
    intro: "Opciones de financiamiento para comprar, construir y remodelar inmuebles, con plazos de hasta 10 años. Las condiciones y la elegibilidad se confirman directamente con el proveedor.",
    categories: [], cta: "Solicitar información",
  },
} as const;

export function generateStaticParams() {
  return Object.keys(data).map((division) => ({ division }));
}

export default async function DivisionPage({ params }: { params: Promise<{ division: string }> }) {
  const { division } = await params;
  const item = data[division as keyof typeof data];
  const info = divisiones.find((d) => d.slug === division);
  if (!item || !info) notFound();

  const contactHref = whatsappUrl(`Hola, me interesa ${item.cta.toLowerCase()} con ${info.nombre}.`);
  const otras = divisiones.filter((d) => d.slug !== division && d.slug !== "financiamiento");

  return (
    <>
      <Navbar />

      <main>
        {/* Portada de la división */}
        <section className="relative isolate overflow-hidden text-white">
          <Image src={item.imagen} alt="" fill priority sizes="100vw" className="ken-burns -z-20 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-marino-950 via-marino-950/85 to-marino-950/40" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-marino-950/70 to-transparent" />

          
          <div className={`mx-auto grid min-h-[78svh] max-w-7xl items-center gap-12 px-6 pb-20 pt-40 sm:px-10 lg:pb-24 ${division !== "financiamiento" ? "lg:grid-cols-[1fr_320px]" : ""}`}>
            
            <div className="fade-up">
              <Link href="/#divisiones" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white">
                <ArrowLeft size={16} /> Grupo Comalba
              </Link>
              <p className="eyebrow mt-12 flex w-fit text-arena-300">{item.eyebrow}</p>
              <p className="mt-4 text-sm font-bold tracking-wide text-white/70">{info.nombre}</p>
              <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">{item.title}</h1>
              <p className="mt-7 max-w-2xl text-[17px] leading-8 text-white/75">{item.intro}</p>
              <a
                href={contactHref}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-dorado-500 px-8 py-4 text-sm font-bold text-marino-950 shadow-xl shadow-dorado-600/30 transition hover:-translate-y-0.5 hover:bg-dorado-400"
              >
                {item.cta} <ArrowUpRight size={17} />
              </a>
            </div>

            {division !== "financiamiento" && (
              <div className="fade-up mx-auto flex h-56 w-full max-w-[320px] items-center justify-center rounded-[2rem] bg-white p-7 shadow-2xl shadow-black/40 [animation-delay:.2s]">
                <Image src={info.logo} alt={`Logo ${info.nombre}`} width={420} height={260} className="max-h-full w-full object-contain" />
              </div>
            )}
          </div>
        </section>

        {/* Catálogo */}
        {item.categories.length > 0 && (
          <section className="bg-marfil px-6 py-20 sm:px-10 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <p className="eyebrow text-dorado-600">Catálogo</p>
              <div className="mb-10 mt-4 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-5xl font-semibold text-marino-900">Opciones disponibles</h2>
                <p className="text-xs text-piedra">Los precios publicados son aproximados.</p>
              </div>
              <PublicListings categories={[...item.categories]} />
            </div>
          </section>
        )}

        {/* Otras divisiones */}
        <section className="bg-white px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow text-dorado-600">También en Grupo Comalba</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
              {otras.map((d) => (
                <Link
                  key={d.slug}
                  href={`/${d.slug}`}
                  aria-label={d.nombre}
                  title={d.nombre}
                  className="group flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-marino-950/10 bg-white p-5 transition hover:-translate-y-1 hover:border-dorado-500/40 hover:shadow-xl"
                >
                  <Image
                    src={d.logo}
                    alt={`Logo ${d.nombre}`}
                    width={180}
                    height={100}
                    className="h-20 w-auto max-w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Llamado a la acción */}
        <section id="contacto" className="bg-marfil px-6 py-20 sm:px-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-marino-900 p-8 text-white sm:p-14">
            <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-dorado-500/25 blur-3xl" />
            <p className="eyebrow relative text-arena-300">Hablemos de tu proyecto</p>
            <div className="relative mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <h2 className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Te ayudamos a encontrar <span className="italic text-arena-200">el siguiente paso.</span>
              </h2>
              <a
                href={contactHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-arena-300 px-8 py-4 text-sm font-bold text-marino-950 transition hover:-translate-y-0.5 hover:bg-arena-200"
              >
                {item.cta} <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
