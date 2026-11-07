import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, Search, ShieldCheck, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { SellForm } from "@/components/SellForm";
import { Reveal } from "@/components/Reveal";
import { DivisionesSelector } from "@/components/DivisionesSelector";
import { Footer } from "@/components/Footer";
import { WhatsAppButton, WhatsAppIcon } from "@/components/WhatsAppButton";
import { contacto, divisiones, formatearTelefono, whatsappUrl } from "@/lib/site";

const principios = [
  {
    titulo: "Nuestra misión",
    texto: "Brindar un servicio inmobiliario profesional y responsable, satisfacer las necesidades de nuestros clientes y aportar valor a los inversores en bienes raíces.",
  },
  {
    titulo: "Nuestra visión",
    texto: "Ser una empresa líder en servicios inmobiliarios, referente de profesionalismo y atención personalizada.",
  },
  {
    titulo: "Nuestros valores",
    texto: "Compromiso · Integridad · Profesionalismo · Responsabilidad",
  },
];

const beneficiosVenta = [
  { icono: ShieldCheck, titulo: "Certeza jurídica", texto: "Revisamos la documentación para que vendas o rentes con seguridad." },
  { icono: Users, titulo: "Acompañamiento personal", texto: "Un asesor te guía desde la primera visita hasta el cierre." },
  { icono: Search, titulo: "Promoción profesional", texto: "Presentamos tu propiedad a las personas correctas." },
];

const pasosValuacion = [
  { titulo: "Cuéntanos sobre tu inmueble", texto: "Compártenos ubicación, superficie y características principales.", detalle: "Por WhatsApp o formulario" },
  { titulo: "Visita y análisis", texto: "Revisamos la propiedad y la comparamos con el mercado de la zona.", detalle: "Un asesor visita el inmueble" },
  { titulo: "Recibe tu valuación", texto: "Te entregamos un valor de referencia para decidir con confianza.", detalle: "Con base en el mercado de la zona" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* =================== INICIO =================== */}
        <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden text-white">
          <HeroSlideshow />

          <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pb-32 sm:pt-36">
            <p className="eyebrow fade-up justify-center text-arena-300 [animation-delay:.1s] after:h-px after:w-6 after:bg-current after:opacity-70 after:content-[''] sm:after:w-10">
              Grupo Comalba · Más de 10 años
            </p>

            <h1 className="fade-up mt-5 text-balance sm:mt-7 font-display text-portada font-semibold [animation-delay:.25s]">
              Creamos espacios
              <span className="mt-1 block font-medium text-arena-200">para vivir el futuro.</span>
            </h1>

            <p className="fade-up mx-auto mt-5 max-w-2xl sm:mt-8 text-base leading-relaxed text-white/85 [animation-delay:.4s] sm:text-lg">
              Un ecosistema inmobiliario que reúne experiencia, diseño y servicio para acompañarte en cada etapa de tu próximo proyecto.
            </p>

            <div className="fade-up mt-7 flex flex-wrap justify-center gap-2.5 [animation-delay:.55s] sm:mt-10 sm:flex-nowrap sm:gap-3">
              <Link
                href="#divisiones"
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-dorado-500 px-4 py-3.5 text-sm sm:flex-none sm:px-8 sm:py-4 font-bold text-marino-950 shadow-xl shadow-dorado-600/30 transition hover:-translate-y-0.5 hover:bg-dorado-400"
              >
                Nuestros servicios
              </Link>
              <Link
                href="#empresa"
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border border-white/35 bg-white/10 px-4 py-3.5 text-sm sm:flex-none sm:px-8 sm:py-4 font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20"
              >
                Conoce el grupo
              </Link>
            </div>

            <div className="fade-up mx-auto mt-8 flex max-w-md items-center justify-center gap-5 border-t border-white/20 pt-5 [animation-delay:.7s] sm:mt-14 sm:gap-12 sm:pt-7">
              <div className="flex items-center gap-3 text-left">
                <span className="font-display text-4xl font-semibold leading-none text-arena-200 sm:text-5xl">10+</span>
                <span className="text-xs leading-5 text-white/70">años construyendo<br />confianza</span>
              </div>
              <span className="h-10 w-px bg-white/20" />
              <div className="flex items-center gap-3 text-left">
                <span className="font-display text-4xl font-semibold leading-none text-arena-200 sm:text-5xl">6</span>
                <span className="text-xs leading-5 text-white/70">servicios<br />especializados</span>
              </div>
            </div>
          </div>

          {/* Indicador para bajar */}
          <a href="#propiedades" aria-label="Bajar a propiedades" className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 md:block">
            <span className="flex h-11 w-7 justify-center rounded-full border-2 border-white/50 pt-2">
              <span className="scroll-dot h-2 w-1 rounded-full bg-white" />
            </span>
          </a>
        </section>

        {/* =================== PROPIEDADES =================== */}
        <section id="propiedades" className="overflow-hidden bg-marfil px-6 py-16 sm:px-10 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-7 flex flex-col justify-between gap-3 sm:mb-12 sm:gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-dorado-600">Oportunidades</p>
                <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-4 text-marino-900">
                  Propiedades destacadas
                </h2>
              </div>
              <p className="max-w-sm text-cuerpo-lg text-piedra">
                Casas, departamentos y terrenos seleccionados por nuestros asesores en Morelos.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <FeaturedProperties />
            </Reveal>

            <Reveal className="mt-6 flex flex-col items-center justify-between gap-4 sm:mt-10 sm:flex-row sm:gap-5">
              <p className="text-xs text-piedra">* Precios aproximados y sujetos a cambios. Confirma disponibilidad con un asesor.</p>
              <Link
                href="/albavera"
                className="inline-flex items-center gap-2 rounded-full bg-marino-900 px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-marino-700"
              >
                Ver todas las propiedades
              </Link>
            </Reveal>
          </div>
        </section>

        {/* =================== VENTA =================== */}
        <section id="venta" className="relative isolate overflow-hidden px-6 py-16 text-white sm:px-10 sm:py-24 lg:py-32">
          {/* Destino de "Solicitar valuación": el formulario lee #valuar y preselecciona Valuar */}
          <span id="valuar" aria-hidden="true" className="absolute inset-x-0 top-0" />
          <Image src="/images/residencia.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: "50% 40%" }} />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-marino-950 via-marino-950/90 to-marino-950/60" />

          <div className="mx-auto grid max-w-7xl items-center gap-9 sm:gap-14 lg:grid-cols-[1fr_1.05fr]">
            <Reveal>
              <p className="eyebrow text-arena-300">Ofrece tu propiedad</p>
              <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-5">
                Cuéntanos sobre tu propiedad.
              </h2>
              <p className="mt-4 max-w-lg text-cuerpo-lg sm:mt-6 text-white/75">
                Si quieres vender, rentar o conocer el valor de tu inmueble, o necesitas alguna asesoría sobre un trámite o proceso de compra, un asesor revisa tu caso, te explica el proceso y te acompaña hasta el cierre.
              </p>

              <ul className="mt-6 space-y-4 sm:mt-10 sm:space-y-6">
                {beneficiosVenta.map(({ icono: Icono, titulo, texto }) => (
                  <li key={titulo} className="flex gap-3 sm:gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-arena-300 sm:size-12 sm:rounded-2xl">
                      <Icono size={21} strokeWidth={1.7} />
                    </span>
                    <span>
                      <span className="block font-bold">{titulo}</span>
                      <span className="mt-1 block text-sm leading-6 text-white/65">{texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <SellForm />
            </Reveal>
          </div>
        </section>

        {/* =================== LA EMPRESA =================== */}
        <section id="empresa" className="bg-marfil px-6 py-16 sm:px-10 sm:py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[4/5] shadow-2xl shadow-marino-950/25">
                <Image src="/images/cuernavaca.jpg" alt="Residencia con alberca en Cuernavaca, Morelos" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="absolute -bottom-5 right-4 rounded-2xl bg-marino-900 p-4 text-white shadow-2xl sm:-bottom-8 sm:-right-6 sm:rounded-3xl sm:p-8">
                <p className="font-display text-4xl font-semibold leading-none text-arena-200 sm:text-6xl">10+</p>
                <p className="mt-1.5 text-xs leading-4 text-white/70 sm:mt-2 sm:text-sm sm:leading-5">años construyendo<br />confianza y oportunidades</p>
              </div>
              <div aria-hidden="true" className="absolute -left-4 -top-4 -z-10 h-40 w-40 rounded-[2rem] border-2 border-dorado-500/40" />
            </Reveal>

            <div>
              <Reveal>
                <p className="eyebrow text-dorado-600">La empresa</p>
                <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-5 text-marino-900">
                  Experiencia que transforma espacios.
                </h2>
                <p className="mt-4 text-cuerpo-lg text-piedra sm:mt-6">
                  Grupo Comalba integra servicios inmobiliarios, diseño y soluciones para acompañar a personas y empresas desde la búsqueda de un espacio hasta hacerlo suyo.
                </p>
              </Reveal>

              <div className="mt-6 divide-y divide-marino-950/10 sm:mt-10 border-y border-marino-950/10">
                {principios.map((p, i) => (
                  <Reveal key={p.titulo} delay={i * 100} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6 sm:py-6">
                    <p className="font-display text-xl font-semibold text-marino-900 sm:text-2xl">{p.titulo}</p>
                    <p className="text-cuerpo text-piedra">{p.texto}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================== DIVISIONES =================== */}
        <section id="divisiones" className="bg-white px-6 py-16 sm:px-10 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal className="grid gap-3 sm:gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
              <h2 className="font-display text-titulo font-semibold text-marino-900">¿Qué necesitas hoy?</h2>
              <p className="text-cuerpo-lg text-piedra">
                Grupo Comalba reúne seis negocios especializados. Elige lo que buscas y te mostramos cuál de ellos te atiende.
              </p>
            </Reveal>

            <Reveal className="mt-8 sm:mt-14">
              <DivisionesSelector />
            </Reveal>
          </div>
        </section>

        {/* =================== VALUACIÓN =================== */}
        <section id="valuacion" className="bg-crema px-6 py-16 sm:px-10 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-3 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <Reveal>
                <p className="eyebrow text-dorado-600">Valuación</p>
                <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-5 text-marino-900">
                  ¿Cuánto vale tu propiedad?
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-cuerpo-lg text-piedra">
                  Conocer el valor real de tu inmueble es el primer paso para venderlo, rentarlo o invertir con seguridad. Te ayudamos en tres pasos.
                </p>
              </Reveal>
            </div>

            {/* Pasos unidos por una línea: vertical en celular, horizontal desde tableta */}
            <Reveal className="mt-8 sm:mt-14">
              <ol className="grid gap-7 sm:gap-10 md:grid-cols-3 md:gap-8">
                {pasosValuacion.map(({ titulo, texto, detalle }, i) => (
                  <li
                    key={titulo}
                    className="relative pl-14 after:absolute after:-bottom-7 after:left-[21px] after:top-11 after:w-0.5 sm:pl-20 sm:after:-bottom-10 sm:after:left-[27px] sm:after:top-14 after:bg-dorado-500 after:content-[''] last:after:hidden md:pl-0 md:pr-6 md:after:-right-8 md:after:bottom-auto md:after:left-14 md:after:top-[27px] md:after:h-0.5 md:after:w-auto"
                  >
                    <span aria-hidden="true" className="absolute left-0 top-0 grid size-11 place-items-center rounded-full bg-marino-900 font-display text-xl font-semibold text-arena-200 sm:size-14 sm:text-2xl md:static">
                      {i + 1}
                    </span>
                    <h3 className="pt-1.5 font-display text-subtitulo sm:pt-2.5 font-semibold text-marino-900 md:mt-6 md:pt-0">{titulo}</h3>
                    <p className="mt-2 max-w-[34ch] text-sm leading-6 text-piedra">{texto}</p>
                    <p className="mt-3 text-sm font-bold text-dorado-600">{detalle}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-8 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href="#valuar"
                data-operacion="Valuar"
                className="inline-flex items-center gap-2 rounded-full bg-dorado-500 px-8 py-4 text-sm font-bold text-marino-950 shadow-lg shadow-dorado-600/25 transition hover:-translate-y-0.5 hover:bg-dorado-400"
              >
                Solicitar valuación
              </a>
              <a
                href={whatsappUrl("Hola, me gustaría solicitar la valuación de una propiedad.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-marino-900/20 px-8 py-4 text-sm font-bold text-marino-900 transition hover:border-marino-900 hover:bg-marino-900 hover:text-white"
              >
                <WhatsAppIcon className="size-[18px]" /> Preguntar por WhatsApp
              </a>
            </Reveal>
          </div>
        </section>

        {/* =================== CONTACTO =================== */}
        <section id="contacto" className="relative isolate overflow-hidden bg-marino-900 px-6 py-16 text-white sm:px-10 sm:py-24 lg:py-28">

          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className="eyebrow text-arena-300">Empecemos una conversación</p>
              <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-5">
                Tu próxima posibilidad comienza aquí.
              </h2>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.45fr]">
              {[
                { href: whatsappUrl("Hola, me interesa conocer más sobre Grupo Comalba."), externo: true, etiqueta: "WhatsApp", valor: "Enviar mensaje", Icono: WhatsAppIcon },
                { href: `tel:+52${contacto.telefono}`, externo: false, etiqueta: "Llámanos", valor: formatearTelefono(contacto.telefono), Icono: Phone },
                { href: `mailto:${contacto.correo}`, externo: false, etiqueta: "Escríbenos", valor: contacto.correo, Icono: Mail },
              ].map(({ href, externo, etiqueta, valor, Icono }, i) => (
                <Reveal key={etiqueta} delay={i * 100}>
                  <a
                    href={href}
                    target={externo ? "_blank" : undefined}
                    rel={externo ? "noreferrer" : undefined}
                    className="group flex h-full items-center gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4 transition sm:gap-5 sm:p-6 duration-300 hover:-translate-y-1 hover:border-arena-300/50 hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arena-300"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-arena-300 sm:size-14 sm:rounded-2xl text-marino-950">
                      <Icono className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">{etiqueta}</span>
                      <span className="mt-1 block text-[15px] font-semibold [overflow-wrap:anywhere]">{valor}</span>
                    </span>
                    {externo && <ArrowUpRight size={18} className="shrink-0 text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-arena-300" />}
                  </a>
                </Reveal>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer mostrarFrase />
      <WhatsAppButton />
    </>
  );
}
