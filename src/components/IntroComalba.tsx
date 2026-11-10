"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Intro de entrada: fondo blanco con el logo al centro; desde el centro del logo nace un círculo
   azul marino que crece detrás del logo hasta cubrir la pantalla, y luego todo se desvanece.
   - Toda la secuencia es CSS (globals.css, bloque "INTRO"): si el JavaScript falla, la intro termina sola.
   - Se muestra una vez por visita: el script de layout.tsx marca <html> antes de pintar.
   - Clic o cualquier tecla la saltan. No aparece en /admin. */
export const CLAVE_INTRO = "comalba-intro-vista";

// Orden de obra: edificio chico, edificio alto, casa, chimenea, nombre, barra GRUPO
const PIEZAS = ["chico", "alto", "casa", "chimenea", "nombre", "barra"] as const;

export function IntroComalba() {
  const ruta = usePathname();
  const [terminada, setTerminada] = useState(false);
  const [saltada, setSaltada] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-vista")) {
      setTerminada(true);
      return;
    }
    const saltar = () => setSaltada(true);
    window.addEventListener("keydown", saltar, { once: true });
    // Respaldo: si la página hidrata tarde y se pierde el fin de la animación, igual se libera
    const respaldo = window.setTimeout(() => {
      document.documentElement.classList.remove("intro-activa");
      try {
        sessionStorage.setItem(CLAVE_INTRO, "1");
      } catch {}
      setTerminada(true);
    }, 4600);
    return () => {
      window.removeEventListener("keydown", saltar);
      window.clearTimeout(respaldo);
    };
  }, []);

  if (terminada || ruta?.startsWith("/admin")) return null;

  const liberarPagina = () => document.documentElement.classList.remove("intro-activa");

  const terminar = () => {
    liberarPagina();
    try {
      sessionStorage.setItem(CLAVE_INTRO, "1");
    } catch {}
    setTerminada(true);
  };

  return (
    <div
      aria-hidden="true"
      className={`intro ${saltada ? "intro-saltada" : ""}`}
      onClick={() => setSaltada(true)}
      onAnimationStart={(e) => {
        // Al empezar a desvanecerse, el inicio arranca sus propias animaciones debajo
        if (e.target === e.currentTarget) liberarPagina();
      }}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) terminar();
      }}
    >
      {/* El azul crece detrás del logo. Encima, la versión con letras y ventanas en blanco se recorta con el mismo
          círculo, así que letras y ventanas cambian justo donde llega el azul y el resto del logo no se toca.
          unoptimized: WebP de 960 px preparados a mano (nítidos en pantallas 2x y ligeros). */}
      <div className="intro-azul" />
      {/* El logo se "construye": cada pieza es una copia del PNG recortada a su zona (globals.css) */}
      <div className="intro-escena">
        <div className="intro-logo intro-obra">
          {PIEZAS.map((pieza) => (
            <div key={pieza} className={`intro-pieza intro-pieza-${pieza}`}>
              <Image src="/logos/comalba-intro.webp" alt="" width={960} height={587} priority unoptimized />
            </div>
          ))}
        </div>
      </div>
      <div className="intro-escena intro-recorte">
        <Image src="/logos/comalba-intro-claro.webp" alt="" width={960} height={587} priority unoptimized className="intro-logo" />
      </div>
    </div>
  );
}

/* Se ejecuta en <head> antes de pintar: decide si esta visita ve la intro. */
export const scriptIntro = `(function(){try{var h=document.documentElement;if(location.pathname.indexOf("/admin")===0)return;if(sessionStorage.getItem("${CLAVE_INTRO}")){h.classList.add("intro-vista")}else{h.classList.add("intro-activa")}}catch(e){}})();`;
