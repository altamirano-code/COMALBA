import Link from "next/link";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { SocialIcons } from "@/components/SocialIcons";
import { avisoLegal, contacto, divisiones, formatearTelefono, navegacion, textoEmpresa } from "@/lib/site";

/* mostrarFrase: solo la página de inicio la manda en true */
export function Footer({ mostrarFrase = false }: { mostrarFrase?: boolean }) {
  return (
    <footer className="bg-marino-950 text-white/65">
      {/* Franja con la presentación de la empresa (solo en el inicio) */}
      {mostrarFrase && (
        <div className="border-t-4 border-dorado-500 bg-marino-800">
          <p className="mx-auto max-w-5xl text-balance px-6 py-8 text-center font-display text-lg font-normal leading-relaxed sm:py-12 text-white sm:px-10 sm:text-2xl sm:leading-normal">
            “{textoEmpresa}”
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-9 px-6 pb-10 pt-10 sm:gap-12 sm:px-10 sm:pb-12 sm:pt-16 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div className="col-span-2 md:col-span-1">
          <span className="inline-grid h-16 w-28 place-items-center rounded-2xl bg-white p-2 shadow-lg sm:h-20 sm:w-36 sm:p-2.5">
            <Image src="/logos/Comalba_Grupo_sf.png" alt="Grupo Comalba" width={1604} height={981} className="h-full w-full object-contain" />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-6 sm:mt-5 sm:leading-7">
            Un ecosistema inmobiliario que reúne experiencia, diseño y servicio para acompañarte en cada etapa.
          </p>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-arena-300">Síguenos</p>
          <div className="mt-3">
            <SocialIcons />
          </div>
        </div>

        <nav aria-label="Secciones">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-arena-300">Explora</p>
          <ul className="mt-5 space-y-3 text-sm">
            {navegacion.map((n) => (
              <li key={n.id}>
                <Link href={n.href} className="transition hover:text-white">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Divisiones">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-arena-300">Divisiones</p>
          <ul className="mt-5 space-y-3 text-sm">
            {divisiones.map((d) => (
              <li key={d.slug}>
                <Link href={`/${d.slug}`} className="transition hover:text-white">{d.nombre}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-arena-300">Encuéntranos</p>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={`tel:+52${contacto.telefono}`} className="flex items-center gap-3 transition hover:text-white">
                <Phone size={16} className="shrink-0 text-arena-300" /> {formatearTelefono(contacto.telefono)}
              </a>
            </li>
            <li>
              <a href={`mailto:${contacto.correo}`} className="flex items-center gap-3 text-[13px] transition hover:text-white [overflow-wrap:anywhere]">
                <Mail size={16} className="shrink-0 text-arena-300" /> {contacto.correo}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="shrink-0 text-arena-300" /> {contacto.ubicacion}
            </li>
            <li>
              <iframe
                title="Mapa: ubicación de Grupo Comalba en Cuernavaca, Morelos"
                src={`https://www.google.com/maps?q=${contacto.mapa.lat},${contacto.mapa.lng}&z=16&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[16/9] w-full rounded-xl border-0 md:aspect-[4/3]"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${contacto.mapa.lat},${contacto.mapa.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-arena-300 transition hover:text-white"
              >
                Abrir en Google Maps <ArrowUpRight size={14} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Aviso legal */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="border-t border-white/10 pt-6 text-xs sm:pt-8 leading-6 text-white/45">{avisoLegal}</p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>© {new Date().getFullYear()} COMALBA S.A. de C.V. Todos los derechos reservados.</p>
        <Link href="/admin" className="w-fit underline underline-offset-4 hover:text-white">Administración</Link>
      </div>
    </footer>
  );
}