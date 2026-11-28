"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hayPaginaAnterior } from "@/lib/navegacion";

/* «Regresar» de la página de una propiedad: vuelve a donde estabas (como la flecha
   de atrás del navegador). Si la abrieron directo, lleva al catálogo de su sección. */
export function BotonRegresar({ alternativa }: { alternativa: string }) {
  const router = useRouter();

  return (
    <button type="button" onClick={() => (hayPaginaAnterior() ? router.back() : router.push(alternativa))} className="boton boton-secundario">
      <ArrowLeft size={16} /> Regresar
    </button>
  );
}
