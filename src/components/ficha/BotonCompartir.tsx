"use client";

import { useState } from "react";
import { Check, Share } from "lucide-react";

/* «Compartir» del enlace sin datos: menú nativo en el celular; en computadora copia el link */
export function BotonCompartir({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const url = window.location.href.split("#")[0]!;
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
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles: no hacemos nada
    }
  }

  return (
    <button type="button" onClick={compartir} className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-neutral-800 transition hover:text-neutral-500">
      {copiado ? <Check size={16} /> : <Share size={16} />} {copiado ? "Link copiado" : "Compartir"}
    </button>
  );
}
