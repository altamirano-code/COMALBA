import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ListadoPublicaciones } from "@/components/ListadoPublicaciones";
import { AlbaveraExplorador } from "@/components/divisiones/AlbaveraExplorador";
import { RentasCiv } from "@/components/divisiones/RentasCiv";
import { AsesoriaProyectos } from "@/components/divisiones/AsesoriaProyectos";
import { AqmenPlanos } from "@/components/divisiones/AqmenPlanos";
import { CotizadorMudanza } from "@/components/divisiones/CotizadorMudanza";
import { CalculadoraFinanciamiento } from "@/components/divisiones/CalculadoraFinanciamiento";
import { CierreDivision } from "@/components/divisiones/CierreDivision";
import { AlInicioAlEntrar } from "@/components/AlInicioAlEntrar";
import { divisiones, type Division } from "@/lib/site";

/* Cada división tiene su propia estructura; aquí solo se define su cierre (contacto) */
const cierre: Record<string, { titulo: string; cta: string }> = {
  albavera: { titulo: "¿Buscas algo que no está publicado? Cuéntanos.", cta: "Hablar con un asesor" },
  "civ-rentas": { titulo: "Te ayudamos a encontrar el espacio para rentar.", cta: "Hablar con CIV Rentas" },
  "asesoria-proyectos": { titulo: "Cuéntanos tu caso y te decimos por dónde empezar.", cta: "Solicitar asesoría" },
  aqmen: { titulo: "Diseñemos la cocina o el clóset de tu casa.", cta: "Agendar visita de medición" },
  immor: { titulo: "¿Tu mudanza es especial? Platícanos los detalles.", cta: "Cotizar con IMMOR" },
  financiamiento: { titulo: "Revisemos juntos tu financiamiento.", cta: "Solicitar información" },
};

const pasosAqmen = [
  { titulo: "Visita y medición", texto: "Vamos a tu casa, medimos el espacio y escuchamos cómo lo usas." },
  { titulo: "Propuesta de diseño", texto: "Te presentamos distribución, materiales, acabados y presupuesto." },
  { titulo: "Fabricación", texto: "Hacemos cada mueble a la medida de tu espacio." },
  { titulo: "Instalación", texto: "Instalamos, ajustamos y entregamos limpio." },
];

const pasosFinanciamiento = [
  { titulo: "Simula tu mensualidad", texto: "Usa la calculadora para conocer un pago aproximado." },
  { titulo: "Platica con un asesor", texto: "Revisamos tu proyecto y cómo puedes comprobar tus ingresos." },
  { titulo: "Integra tu expediente", texto: "Te decimos qué documentos reunir y te ayudamos a completarlos." },
  { titulo: "Avanza con tu proyecto", texto: "Compra, construye o remodela con pagos fijos a 10 años." },
];

function Pasos({ titulo, pasos }: { titulo: string; pasos: { titulo: string; texto: string }[] }) {
  return (
    <section className="bg-white px-6 py-12 sm:px-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight text-marino-900 sm:text-5xl">{titulo}</h2>
        <ol className="mt-7 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="border-t-2 border-marino-900 pt-3 sm:pt-5">
              <span className="font-hero text-base font-semibold text-dorado-600 sm:text-lg">Paso {i + 1}</span>
              <h3 className="mt-1 font-display text-xl font-semibold text-marino-900 sm:mt-2 sm:text-2xl">{p.titulo}</h3>
              <p className="mt-2 text-cuerpo text-piedra">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contenido({ division }: { division: Division }) {
  switch (division.slug) {
    case "albavera":
      return <AlbaveraExplorador division={division} />;
    case "civ-rentas":
      return <RentasCiv division={division} />;
    case "asesoria-proyectos":
      return <AsesoriaProyectos division={division} />;
    case "aqmen":
      return (
        <>
          <AqmenPlanos division={division} />
          <Pasos titulo="De la medición a la instalación." pasos={pasosAqmen} />
          <section className="bg-marfil px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-display text-3xl font-semibold text-marino-900 sm:text-4xl">Proyectos AQMEN</h2>
              <div className="mt-6 sm:mt-8">
                <ListadoPublicaciones seccion="aqmen" />
              </div>
            </div>
          </section>
        </>
      );
    case "immor":
      return <CotizadorMudanza division={division} />;
    case "financiamiento":
      return (
        <>
          <CalculadoraFinanciamiento division={division} />
          <Pasos titulo="Cómo obtener tu financiamiento." pasos={pasosFinanciamiento} />
        </>
      );
    default:
      return null;
  }
}

export function generateStaticParams() {
  return divisiones.map((d) => ({ division: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ division: string }> }): Promise<Metadata> {
  const { division } = await params;
  const info = divisiones.find((d) => d.slug === division);
  return info ? { title: `${info.nombre} | Grupo Comalba`, description: info.resumen } : {};
}

export default async function DivisionPage({ params }: { params: Promise<{ division: string }> }) {
  const { division } = await params;
  const info = divisiones.find((d) => d.slug === division);
  if (!info || !cierre[division]) notFound();

  return (
    <>
      <AlInicioAlEntrar />
      <Navbar />
      <main>
        <Contenido division={info} />
        <CierreDivision division={info} {...cierre[division]} />
      </main>
      <Footer />
      <WhatsAppButton telefono={info.telefono} mensaje={`Hola, me interesa conocer más sobre ${info.nombre}.`} nombre={info.nombre} />
    </>
  );
}
