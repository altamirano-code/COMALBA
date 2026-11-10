"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ArrowUpRight, Landmark } from "lucide-react";
import { divisiones, navegacion, whatsappUrl } from "@/lib/site";

/* La posición donde se inserta "Servicios" dentro del menú */
const POSICION_DIVISIONES = 4;

export function Navbar() {
  const pathname = usePathname();
  const esInicio = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [divisionesAbierto, setDivisionesAbierto] = useState(false);
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [movilDivisiones, setMovilDivisiones] = useState(false);
  const [activo, setActivo] = useState("inicio");
  const dropdownRef = useRef<HTMLLIElement>(null);
  const cerrarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Se vuelve más sólida al bajar para que el texto siempre se lea */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Resalta la sección visible en la página de inicio */
  useEffect(() => {
    if (!esInicio) return;
    const secciones = navegacion
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const divs = document.getElementById("divisiones");
    if (divs) secciones.push(divs);

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActivo(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secciones.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [esInicio]);

  /* Cierra el desplegable con Escape o al hacer clic fuera */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDivisionesAbierto(false);
        setMovilAbierto(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDivisionesAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  /* Evita que la página se mueva detrás del menú móvil.
     Al cerrarlo (X, un enlace o Escape) también se pliega Servicios, para que la próxima vez abra limpio. */
  useEffect(() => {
    document.body.style.overflow = movilAbierto ? "hidden" : "";
    if (!movilAbierto) setMovilDivisiones(false);
    return () => {
      document.body.style.overflow = "";
    };
  }, [movilAbierto]);

  const abrirDivisiones = () => {
    if (cerrarTimer.current) clearTimeout(cerrarTimer.current);
    setDivisionesAbierto(true);
  };
  const cerrarDivisiones = () => {
    cerrarTimer.current = setTimeout(() => setDivisionesAbierto(false), 140);
  };

  const divisionActiva = divisiones.some((d) => pathname === `/${d.slug}`) || (esInicio && activo === "divisiones");

  const linkClase = (id: string) =>
    `relative px-1 py-2 text-[0.8125rem] font-semibold tracking-wide transition-colors duration-300 after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:origin-left after:bg-arena-300 after:transition-transform after:duration-300 ${
      esInicio && activo === id
        ? "text-white after:scale-x-100"
        : "text-white/75 hover:text-white after:scale-x-0 hover:after:scale-x-100"
    }`;

  const itemsAntes = navegacion.slice(0, POSICION_DIVISIONES);
  const itemsDespues = navegacion.slice(POSICION_DIVISIONES);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        aria-label="Navegación principal"
        className={`group/nav mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-3 py-2.5 text-white transition-all duration-500 sm:px-5 ${
          scrolled || movilAbierto || !esInicio
            ? "border-white/15 bg-marino-950/80 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "border-white/15 bg-white/[0.06] backdrop-blur-md hover:border-white/25 hover:bg-marino-950/55"
        }`}
      >
        {/* Logo */}
        <Link href="/#inicio" className="flex shrink-0 items-center gap-3" aria-label="Grupo Comalba, inicio" onClick={() => setMovilAbierto(false)}>
          <span className="grid h-12 w-[82px] place-items-center rounded-xl bg-white px-1.5 py-1 shadow-md shadow-black/20 ring-1 ring-white/40 sm:h-[52px] sm:w-[96px]">
            <Image src="/logos/Comalba_Grupo_sf.png" alt="Grupo Comalba" width={1604} height={981} priority sizes="96px" className="h-full w-full object-contain" />
          </span>
          <span className="leading-none">
            <strong className="block font-marca text-[1.35rem] font-semibold tracking-[0.12em]">COMALBA</strong>
            <small className="mt-1 block text-[0.5625rem] font-semibold tracking-[0.28em] text-white/60">GRUPO INMOBILIARIO</small>
          </span>
        </Link>

        {/* Menú de escritorio */}
        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {itemsAntes.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={linkClase(item.id)}>
                {item.label}
              </Link>
            </li>
          ))}

          <li ref={dropdownRef} className="relative" onMouseEnter={abrirDivisiones} onMouseLeave={cerrarDivisiones}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={divisionesAbierto}
              onClick={() => setDivisionesAbierto((v) => !v)}
              className={`flex items-center gap-1.5 px-1 py-2 text-[0.8125rem] font-semibold tracking-wide transition-colors ${
                divisionActiva || divisionesAbierto ? "text-white" : "text-white/75 hover:text-white"
              }`}
            >
              Servicios
              <ChevronDown size={15} className={`transition-transform duration-300 ${divisionesAbierto ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-4 transition-all duration-300 ${
                divisionesAbierto ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-marino-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <p className="px-3 pb-2 pt-2 text-[0.625rem] font-bold uppercase tracking-[0.28em] text-arena-300">Nuestros servicios</p>
                {divisiones.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    onClick={() => setDivisionesAbierto(false)}
                    className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.07]"
                  >
                    {!d.logo ? (
                      <span className="grid h-11 w-16 shrink-0 place-items-center rounded-lg border border-arena-300/30 bg-white/[0.06] text-arena-300">
                        <Landmark size={18} strokeWidth={1.7} />
                      </span>
                    ) : (
                      <span className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                        <Image src={d.logo!} alt="" width={128} height={88} className="h-auto max-h-full w-auto max-w-full object-contain" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white">{d.nombre}</span>
                      <span className="block text-xs text-white/55">{d.etiqueta}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </li>

          {itemsDespues.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={linkClase(item.id)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón de contacto */}
        <a
          href={whatsappUrl("Hola, me interesa conocer más sobre Grupo Comalba.")}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full bg-dorado-500 px-5 py-2.5 text-[0.8125rem] font-bold text-marino-950 shadow-lg shadow-dorado-600/30 transition hover:-translate-y-0.5 hover:bg-dorado-400 xl:inline-flex"
        >
          Escríbenos <ArrowUpRight size={15} />
        </a>

        {/* Botón del menú móvil */}
        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-white/20 bg-white/5 transition hover:bg-white/10 lg:hidden"
          aria-label={movilAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={movilAbierto}
          onClick={() => setMovilAbierto((v) => !v)}
        >
          {movilAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Menú móvil */}
      <div
        className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-marino-950/95 text-white shadow-2xl backdrop-blur-xl transition-all duration-500 lg:hidden ${
          movilAbierto ? "visible max-h-[calc(100svh-6rem)] opacity-100" : "invisible max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100svh-6rem)] overflow-y-auto p-3">
          {itemsAntes.map((item) => (
            <Link key={item.id} href={item.href} onClick={() => setMovilAbierto(false)} className="block rounded-xl px-4 py-3.5 text-[0.9375rem] font-semibold text-white/85 hover:bg-white/5">
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setMovilDivisiones((v) => !v)}
            aria-expanded={movilDivisiones}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[0.9375rem] font-semibold text-white/85 hover:bg-white/5"
          >
            Servicios
            <ChevronDown size={18} className={`transition-transform duration-300 ${movilDivisiones ? "rotate-180" : ""}`} />
          </button>
          <div className={`grid transition-all duration-300 ${movilDivisiones ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div className="mb-2 ml-4 border-l border-white/10 pl-2">
                {divisiones.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    onClick={() => setMovilAbierto(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5"
                  >
                    {!d.logo ? (
                      <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg border border-arena-300/30 bg-white/[0.06] text-arena-300">
                        <Landmark size={17} strokeWidth={1.7} />
                      </span>
                    ) : (
                      <span className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                        <Image src={d.logo!} alt="" width={112} height={80} className="h-auto max-h-full w-auto max-w-full object-contain" />
                      </span>
                    )}

                    <span>
                      <span className="block text-sm font-semibold">{d.nombre}</span>
                      <span className="block text-xs text-white/50">{d.etiqueta}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {itemsDespues.map((item) => (
            <Link key={item.id} href={item.href} onClick={() => setMovilAbierto(false)} className="block rounded-xl px-4 py-3.5 text-[0.9375rem] font-semibold text-white/85 hover:bg-white/5">
              {item.label}
            </Link>
          ))}

          <a
            href={whatsappUrl("Hola, me interesa conocer más sobre Grupo Comalba.")}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-dorado-500 px-4 py-3.5 text-sm font-bold text-marino-950"
          >
            Escríbenos por WhatsApp <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
