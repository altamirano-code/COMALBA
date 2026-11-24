"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/* Botón cuadrado de la barra superior de la ficha: copia el link de la página actual */
export function BotonCopiarLink() {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]!);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles: no hacemos nada
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={copiado ? "Link copiado" : "Copiar link de esta página"}
      title={copiado ? "Link copiado" : "Copiar link"}
      className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-neutral-800 ring-1 ring-black/[0.06] transition hover:bg-neutral-950 hover:text-white"
    >
      {copiado ? <Check size={18} /> : <Link2 size={18} />}
    </button>
  );
}
