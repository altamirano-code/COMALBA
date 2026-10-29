"use client";

import { useEffect, useRef, useState } from "react";
import { contacto, iconosRedes } from "@/lib/site";

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.5 21v-7.6h2.6l.4-3H13.5V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Muestra la imagen del ícono; si no carga, usa el ícono dibujado */
function IconoRed({ src, Respaldo }: { src: string; Respaldo: typeof FacebookIcon }) {
  const [fallo, setFallo] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  /* Si la imagen falló antes de que React cargara, onError no se dispara: se revisa aquí */
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFallo(true);
  }, []);

  if (fallo || !src) return <Respaldo className="size-5" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={src} alt="" className="size-full object-contain" onError={() => setFallo(true)} />
  );
}

/* Íconos de redes. Solo se muestran las redes que tengan enlace en src/lib/site.ts */
export function SocialIcons() {
  const redes = [
    { nombre: "Facebook", href: contacto.facebook, src: iconosRedes.facebook, Respaldo: FacebookIcon },
    { nombre: "Instagram", href: contacto.instagram, src: iconosRedes.instagram, Respaldo: InstagramIcon },
  ].filter((r) => r.href && r.href !== "#");

  return (
    <div className="flex gap-3">
      {redes.map(({ nombre, href, src, Respaldo }) => (
        <a
          key={nombre}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${nombre} de Grupo Comalba`}
          title={nombre}
          className="grid size-11 place-items-center overflow-hidden rounded-xl bg-white/[0.06] text-white ring-1 ring-white/15 transition duration-300 hover:-translate-y-0.5 hover:ring-arena-300"
        >
          <IconoRed src={src} Respaldo={Respaldo} />
        </a>
      ))}
    </div>
  );
}
