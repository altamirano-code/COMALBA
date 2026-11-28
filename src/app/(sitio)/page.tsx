import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Search, ShieldCheck, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { SellForm } from "@/components/SellForm";
import { FormularioContacto } from "@/components/FormularioContacto";
import { Reveal } from "@/components/Reveal";
import { DivisionesSelector } from "@/components/DivisionesSelector";
import { Footer } from "@/components/Footer";
import { WhatsAppButton, WhatsAppIcon } from "@/components/WhatsAppButton";
import { contacto, formatearTelefono, whatsappUrl } from "@/lib/site";

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

/* Solo datos reales; agregar aquí operaciones cerradas o asesores cuando se tengan */
const cifrasEmpresa = [
  { valor: "10+", etiqueta: "años en el mercado" },
  { valor: "6", etiqueta: "negocios especializados" },
  { valor: "Cuernavaca", etiqueta: "nuestra base en Morelos" },
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

            <h1 aria-label="Creamos espacios para vivir el futuro." className="titulo-efecto mt-5 text-balance sm:mt-7 font-display text-portada font-semibold uppercase">
              {/* lg:whitespace-nowrap: en escritorio va en un renglón (≈650 px en Poppins). Sin esto, la fuente de
                  respaldo (más ancha) lo partía en dos mientras cargaba Poppins y el inicio saltaba al llegar. */}
              <span aria-hidden="true" className="block lg:whitespace-nowrap">
                {["Creamos", "espacios"].map((p, i) => (
                  <Fragment key={p}>
                  <span className="palabra">
                    <span style={{ "--i": i } as CSSProperties}>{p}</span>
                  </span>{" "}
                  </Fragment>
                ))}
              </span>
              <span aria-hidden="true" className="mt-2 block text-[0.42em] font-light tracking-[0.08em] text-arena-200">
                {["para", "vivir", "el", "futuro."].map((p, i) => (
                  <Fragment key={p}>
                  <span className="palabra brillo">
                    <span style={{ "--i": i + 2 } as CSSProperties}>{p}</span>
                  </span>{" "}
                  </Fragment>
                ))}
              </span>
            </h1>

            <p className="fade-up mx-auto mt-5 max-w-2xl sm:mt-8 text-base leading-relaxed text-white/85 [animation-delay:.4s] sm:text-lg">
              Un ecosistema inmobiliario que reúne experiencia, diseño y servicio para acompañarte en cada etapa de tu próximo proyecto.
            </p>

            <div className="fade-up mt-7 flex flex-wrap justify-center gap-2.5 [animation-delay:.55s] sm:mt-10 sm:flex-nowrap sm:gap-3">
              <Link
                href="#divisiones"
                className="boton boton-dorado flex-1 whitespace-nowrap sm:flex-none sm:px-8"
              >
                Nuestros servicios
              </Link>
              <Link
                href="#empresa"
                className="boton boton-contorno flex-1 whitespace-nowrap backdrop-blur-md sm:flex-none sm:px-8"
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
        <section id="propiedades" className="overflow-hidden bg-marfil px-6 py-10 sm:px-10 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-7xl">
            {/* Como en la demo: "Ver todas las propiedades" arriba a la derecha, junto al título */}
            <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-5 sm:mb-12">
              <div>
                <p className="eyebrow text-dorado-600">Oportunidades</p>
                <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-4 text-marino-900">
                  Propiedades destacadas
                </h2>
                <p className="mt-3 max-w-xl text-cuerpo-lg text-piedra sm:mt-4">
                  Casas, departamentos y terrenos seleccionados por nuestros asesores en Morelos.
                </p>
              </div>
              <Link href="/albavera" className="boton boton-secundario">
                Ver todas las propiedades
              </Link>
            </Reveal>

            <Reveal delay={120}>
              {/* La nota va en la misma fila que las flechas */}
              <FeaturedProperties nota={<p className="text-xs text-piedra">* Precios aproximados y sujetos a cambios. Confirma disponibilidad con un asesor.</p>} />
            </Reveal>
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

        {/* =================== POR QUÉ COMALBA =================== */}
        <section id="empresa" className="bg-white px-6 pb-16 pt-12 sm:px-10 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className="eyebrow text-dorado-600">La empresa</p>
              <h2 className="mt-3 font-display text-titulo font-semibold text-marino-900 sm:mt-5">Por qué COMALBA</h2>            </Reveal>

            <dl className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
              {cifrasEmpresa.map((c) => (
                <div key={c.etiqueta} className="flex flex-col rounded-xl bg-marfil p-6">
                  <dt className="text-sm text-piedra">{c.etiqueta}</dt>
                  <dd className="order-first font-display text-4xl font-semibold text-marino-900">{c.valor}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid items-center gap-10 sm:mt-12 lg:grid-cols-2 lg:gap-20">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src="/images/cuernavaca.jpg" alt="Residencia con alberca en Cuernavaca, Morelos" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>

              <div>
                <Reveal>
                  <p className="text-cuerpo-lg text-piedra">
                    Grupo Comalba integra servicios inmobiliarios, diseño y soluciones para acompañar a personas y empresas desde la búsqueda de un espacio hasta hacerlo suyo.
                  </p>
                </Reveal>

                <div className="mt-6 divide-y divide-marino-950/10 border-y border-marino-950/10 sm:mt-10">
                  {principios.map((p, i) => (
                    <Reveal key={p.titulo} delay={i * 100} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6 sm:py-6">
                      <p className="font-display text-xl font-semibold text-marino-900 sm:text-2xl">{p.titulo}</p>
                      <p className="text-cuerpo text-piedra">{p.texto}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================== VALUACIÓN =================== */}
        <section id="valuacion" className="bg-crema px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
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
                className="boton boton-principal"
              >
                Solicitar valuación
              </a>
              <a
                href={whatsappUrl("Hola, me gustaría solicitar la valuación de una propiedad.")}
                target="_blank"
                rel="noreferrer"
                className="boton boton-secundario"
              >
                <WhatsAppIcon className="size-[18px]" /> Preguntar por WhatsApp
              </a>
            </Reveal>
          </div>
        </section>

        {/* =================== CONTACTO =================== */}
        <section id="contacto" className="bg-marino-900 px-6 py-16 text-white sm:px-10 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <Reveal className="max-w-3xl">
                <p className="eyebrow text-arena-300">Contacto</p>
                <h2 className="mt-3 font-display text-titulo font-semibold sm:mt-5">Hablemos de tu próxima propiedad</h2>
              </Reveal>
              <ul className="mt-8 space-y-5 sm:mt-10">
                <li>
                  <a href={whatsappUrl("Hola, me interesa conocer más sobre Grupo Comalba.")} target="_blank" rel="noreferrer" className="boton boton-dorado">
                    <WhatsAppIcon className="size-5" /> Escríbenos por WhatsApp
                  </a>
                </li>
                <li className="flex items-center gap-3 text-cuerpo-lg">
                  <Phone size={20} className="text-arena-300" />
                  <a href={`tel:+52${contacto.telefono}`} className="hover:underline">{formatearTelefono(contacto.telefono)}</a>
                </li>
              </ul>
            </div>
            <FormularioContacto />
          </div>
        </section>
      </main>

      <Footer mostrarFrase />
      <WhatsAppButton />
    </>
  );
}
