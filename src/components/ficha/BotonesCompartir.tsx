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
    "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition sm:flex-none";

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={() => compartir(null, "Link copiado")} className={`${boton} bg-neutral-950 text-white hover:bg-neutral-800`}>
          <Share2 size={17} /> Compartir link
        </button>
        {codigoSinDatos && (
          <button
            type="button"
            onClick={() => compartir(`/p/${codigoSinDatos}`, "Link sin datos copiado")}
            className={`${boton} bg-white text-neutral-900 ring-1 ring-black/10 hover:bg-neutral-50`}
          >
            <EyeOff size={17} /> Compartir sin datos
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className={`mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-800 transition-opacity ${copiado ? "opacity-100" : "opacity-0"}`}>
        <Check size={16} /> {copiado || " "}
      </p>
    </div>
  );
}
