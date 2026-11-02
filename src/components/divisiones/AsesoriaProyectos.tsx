import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappUrl, type Division } from "@/lib/site";

const SERVICIOS = [
  {
    id: "juridica",
    nombre: "Asesoría jurídica",
    texto: "Revisamos que la operación y los papeles estén en orden antes de que firmes o pagues.",
    incluye: ["Revisión de escrituras y títulos de propiedad", "Contratos de compraventa y arrendamiento", "Regularización de inmuebles", "Acompañamiento en notaría"],
  },
  {
    id: "gestoria",
    nombre: "Gestoría inmobiliaria",
    texto: "Hacemos por ti los trámites ante dependencias para que no pierdas días en filas.",
    incluye: ["Predial y agua", "Certificados de libertad de gravamen", "Trámites de catastro", "Licencias y permisos"],
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento residencial",
    texto: "Cuidamos tu inmueble para que conserve su valor, se viva bien o se rente mejor.",
    incluye: ["Plomería y electricidad", "Pintura e impermeabilización", "Jardinería y albercas", "Revisiones periódicas"],
  },
  {
    id: "proyectos",
    nombre: "Desarrollo de proyectos",
    texto: "Acompañamos tu obra desde la idea y el presupuesto hasta la entrega.",
    incluye: ["Planeación y anteproyecto", "Presupuestos de obra", "Supervisión de construcción", "Remodelaciones"],
  },
];

const ETAPAS = [
  { etapa: "Antes de invertir", texto: "Verificamos documentos, gravámenes y uso de suelo.", servicios: ["juridica", "gestoria"] },
  { etapa: "Durante la operación", texto: "Contratos, notaría, permisos y obra en marcha.", servicios: ["juridica", "gestoria", "proyectos"] },
  { etapa: "Después de la compra", texto: "Mantenimiento y mejoras para que tu inmueble conserve su valor.", servicios: ["mantenimiento", "proyectos"] },
];

const nombreDe = (id: string) => SERVICIOS.find((s) => s.id === id)!.nombre;

/* Página sin fotografía: un índice de servicios, como un expediente bien ordenado */
export function AsesoriaProyectos({ division }: { division: Division }) {
  return (
    <>
      <section className="bg-marfil px-6 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-36 lg:pb-24 lg:pt-44">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Link href="/#divisiones" className="inline-flex items-center gap-2 text-sm font-semibold text-piedra transition hover:text-marino-900">
              <ArrowLeft size={16} /> Grupo Comalba
            </Link>
            <p className="mt-5 text-base font-semibold text-dorado-600 sm:mt-10 sm:text-lg">{division.nombre}</p>
            <h1 className="fade-up mt-3 text-balance font-display text-4xl font-semibold leading-[1.02] text-marino-900 sm:text-6xl lg:text-7xl">
              Lo que tu inmueble necesita, resuelto por especialistas.
            </h1>
            <p className="mt-4 max-w-lg text-cuerpo-lg sm:mt-7 text-piedra">
              Un mismo equipo para el lado legal, los trámites, el mantenimiento y la obra. Elige el servicio y te contactamos con la persona indicada.
            </p>
          </div>

          {/* Índice de servicios */}
          <nav aria-label="Servicios de asesoría" className="self-end">
            <ul className="border-t-2 border-marino-900">
              {SERVICIOS.map((s) => (
                <li key={s.id} className="border-b border-marino-950/15">
                  <a href={`#${s.id}`} className="group flex items-baseline justify-between gap-6 py-3 transition sm:py-5 hover:pl-2">
                    <span className="font-display text-2xl font-semibold text-marino-900 sm:text-4xl">{s.nombre}</span>
                    <span className="hidden shrink-0 text-sm font-semibold text-piedra transition group-hover:text-dorado-600 sm:inline">Ver detalle</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Etapas de una inversión: es una secuencia real */}
      <section className="bg-marino-900 px-6 py-12 text-white sm:px-10 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">Te acompañamos en cada momento de tu inversión.</h2>
          <ol className="mt-6 grid gap-px sm:mt-12 overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
            {ETAPAS.map((e) => (
              <li key={e.etapa} className="bg-marino-900 p-5 sm:p-7 md:p-8">
                <p className="font-display text-xl font-semibold text-arena-200 sm:text-2xl">{e.etapa}</p>
                <p className="mt-2 text-cuerpo text-white/70 sm:mt-3">{e.texto}</p>
                <ul className="mt-4 flex flex-wrap gap-2 sm:mt-6">
                  {e.servicios.map((id) => (
                    <li key={id}>
                      <a href={`#${id}`} className="block rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:border-arena-300 hover:text-arena-200">
                        {nombreDe(id)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Detalle de cada servicio */}
      <section className="bg-white px-6 py-12 sm:px-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl divide-y divide-marino-950/10">
          {SERVICIOS.map((s) => (
            <article key={s.id} id={s.id} className="grid scroll-mt-28 gap-4 py-8 first:pt-0 last:pb-0 sm:gap-6 sm:py-12 lg:grid-cols-[1fr_1fr_auto] lg:gap-12">
              <div>
                <h2 className="font-display text-2xl font-semibold text-marino-900 sm:text-4xl">{s.nombre}</h2>
                <p className="mt-2 max-w-md text-cuerpo sm:mt-3 text-piedra">{s.texto}</p>
              </div>
              <ul className="grid gap-x-8 gap-y-2 text-[15px] sm:gap-y-3 text-tinta sm:grid-cols-2 lg:grid-cols-1">
                {s.incluye.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-dorado-500" />
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(`Hola, me interesa el servicio de ${s.nombre.toLowerCase()} de Grupo Comalba.`, division.telefono)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-fit w-fit items-center gap-2 rounded-full border border-marino-900/25 px-6 py-3 text-sm font-bold text-marino-900 transition hover:border-marino-900 hover:bg-marino-900 hover:text-white"
              >
                <WhatsAppIcon className="size-4" /> Consultar este servicio
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
