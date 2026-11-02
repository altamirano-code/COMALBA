import Link from "next/link";
import { Phone } from "lucide-react";
import { FormularioArea } from "@/components/divisiones/FormularioArea";
import { MarcaDivision } from "@/components/divisiones/MarcaDivision";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { divisiones, formatearTelefono, whatsappUrl, type Division } from "@/lib/site";

/* Cierre común de cada división: contacto directo y el resto del grupo */
export function CierreDivision({ division, titulo, cta }: { division: Division; titulo: string; cta: string }) {
  const otras = divisiones.filter((d) => d.slug !== division.slug);

  return (
    <>
      <section id="contacto" className="bg-marino-900 px-6 py-12 text-white sm:px-10 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div className="flex flex-col gap-4 sm:gap-6">
            <h2 className="max-w-xl text-balance font-display text-3xl font-semibold leading-tight sm:text-5xl">{titulo}</h2>
            <p className="max-w-md text-cuerpo text-white/70">
              Déjanos tus datos y un asesor de {division.nombre} te contactará. Si lo prefieres, escríbenos directo.
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={whatsappUrl(`Hola, me interesa ${cta.toLowerCase()} con ${division.nombre}.`, division.telefono)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arena-200"
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
          <FormularioArea division={division} />
        </div>
      </section>

      <section aria-labelledby="grupo-titulo" className="bg-white px-6 py-10 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 id="grupo-titulo" className="font-display text-2xl font-semibold text-marino-900 sm:text-3xl">
            Otros servicios de Grupo Comalba
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-px sm:mt-8 overflow-hidden rounded-2xl border border-marino-950/10 bg-marino-950/10 md:grid-cols-5">
            {otras.map((d) => (
              <li key={d.slug} className="bg-white odd:last:col-span-2 md:odd:last:col-span-1">
                <Link href={`/${d.slug}`} className="group @container flex h-full flex-col items-center gap-2 p-3 text-center sm:gap-3 sm:p-5 transition hover:bg-marfil">
                  <MarcaDivision division={d} ajustable className="h-16 w-full sm:h-20" />
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
