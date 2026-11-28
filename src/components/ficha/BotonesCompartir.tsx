"use client";

import { useEffect, useState } from "react";
import { Check, EyeOff, Share2 } from "lucide-react";

/* "Compartir link" (página con marca) y "Compartir sin datos" (/p/[codigo]).
   El segundo solo aparece si Comalba dejó activo el enlace y permite que las aliadas lo compartan.
   En el celular usa el menú nativo de compartir; si no existe, copia el link. */
export function BotonesCompartir({ titulo, codigoSinDatos }: { titulo: string; codigoSinDatos: string | null }) {
  const [copiado, setCopiado] = useState("");

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(""), 2500);
    return () => clearTimeout(t);
  }, [copiado]);

  async function compartir(ruta: string | null, aviso: string) {
    const url = ruta ? `${window.location.origin}${ruta}` : window.location.href.split("#")[0]!;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(aviso);
    } catch {
      setCopiado(`Copia este link: ${url}`);
    }
  }

  const boton =
    "boton flex-1 sm:flex-none";

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={() => compartir(null, "Link copiado")} className={`${boton} boton-principal`}>
          <Share2 size={17} /> Compartir link
        </button>
        {codigoSinDatos && (
          <button
            type="button"
            onClick={() => compartir(`/p/${codigoSinDatos}`, "Link sin datos copiado")}
            className={`${boton} boton-secundario`}
          >
            <EyeOff size={17} /> Compartir sin datos
          </button>
        )}
      </div>
      {/* Flota debajo de los botones: no aparta espacio cuando no hay aviso */}
      <p role="status" aria-live="polite" className={`pointer-events-none absolute left-0 top-full mt-2 flex w-full items-center gap-1.5 break-all text-sm font-medium text-emerald-800 transition-opacity ${copiado ? "opacity-100" : "opacity-0"}`}>
        <Check size={16} /> {copiado || " "}
      </p>
    </div>
  );
}
