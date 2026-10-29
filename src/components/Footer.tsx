import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { LogoComalba } from "@/components/Logo";
import { SocialIcons } from "@/components/SocialIcons";
import { avisoLegal, contacto, divisiones, formatearTelefono, navegacion, textoEmpresa } from "@/lib/site";

/* mostrarFrase: solo la página de inicio la manda en true */
export function Footer({ mostrarFrase = false }: { mostrarFrase?: boolean }) {
  return (
    <footer className="bg-marino-950 text-white/65">
      {/* Franja con la presentación de la empresa (solo en el inicio) */}
      {mostrarFrase && (
        <div className="border-t-4 border-dorado-500 bg-marino-800">
          <p className="mx-auto max-w-5xl px-6 py-12 text-center font-display text-2xl font-medium italic leading-snug text-white sm:px-10 sm:text-[2rem]">
            “{textoEmpresa}”
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-12 pt-16 sm:px-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div>
          <span className="inline-grid h-20 w-36 place-items-center rounded-2xl bg-white p-2.5 shadow-lg">
            <LogoComalba className="h-full w-full object-contain" />
          </span>
          <p className="mt-5 max-w-xs text-sm leading-7">
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

        <div>
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
          </ul>
        </div>
      </div>

      {/* Aviso legal */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="border-t border-white/10 pt-8 text-xs leading-6 text-white/45">{avisoLegal}</p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>© {new Date().getFullYear()} COMALBA S.A. de C.V. Todos los derechos reservados.</p>
        <Link href="/admin" className="w-fit underline underline-offset-4 hover:text-white">Administración</Link>
      </div>
    </footer>
  );
}