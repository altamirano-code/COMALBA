import Link from "next/link";
import { Phone } from "lucide-react";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { divisiones, formatearTelefono, whatsappUrl, type Division } from "@/lib/site";

/* Cierre común de cada división: contacto directo y el resto del grupo */
export function CierreDivision({ division, titulo, cta }: { division: Division; titulo: string; cta: string }) {
  const otras = divisiones.filter((d) => d.slug !== division.slug);

  return (
    <>
      <section id="contacto" className="bg-marino-900 px-6 py-20 text-white sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <h2 className="max-w-xl text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl">{titulo}</h2>
          <div className="flex flex-col gap-4 md:items-end">
            <a
              href={whatsappUrl(`Hola, me interesa ${cta.toLowerCase()} con ${division.nombre}.`, division.telefono)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2.5 rounded-full bg-dorado-500 px-8 py-4 text-sm font-bold text-marino-950 transition hover:bg-dorado-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arena-200"
            >
              <WhatsAppIcon className="size-[18px]" /> {cta}
            </a>
            {division.telefono && (
              <a href={`tel:+52${division.telefono}`} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white">
                <Phone size={16} /> Llamar al {formatearTelefono(division.telefono)}
              </a>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="grupo-titulo" className="bg-white px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 id="grupo-titulo" className="font-display text-3xl font-semibold text-marino-900">
            Otros servicios de Grupo Comalba
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-marino-950/10 bg-marino-950/10 md:grid-cols-5">
            {otras.map((d) => (
              <li key={d.slug} className="bg-white odd:last:col-span-2 md:odd:last:col-span-1">
                <Link href={`/${d.slug}`} className="group flex h-full flex-col items-center gap-3 p-5 text-center transition hover:bg-marfil">
                  <MarcaDivision division={d} className="h-20 w-full" />
                  <span className="text-xs font-semibold text-piedra group-hover:text-marino-900">{d.etiqueta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
