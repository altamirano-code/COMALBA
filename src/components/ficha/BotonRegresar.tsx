"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hayPaginaAnterior } from "@/lib/navegacion";

/* «Regresar» de la página de una propiedad: vuelve a donde estabas (como la flecha
   de atrás del navegador). Si la abrieron directo, lleva al catálogo de su sección. */
export function BotonRegresar({ alternativa }: { alternativa: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (hayPaginaAnterior() ? router.back() : router.push(alternativa))}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-white/80 px-4 text-sm font-semibold text-neutral-800 ring-1 ring-black/[0.05] transition hover:bg-white"
    >
      <ArrowLeft size={16} /> Regresar
    </button>
  );
}
