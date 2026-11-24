"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { guardarPosicion, registrarVisita } from "@/lib/navegacion";

/* Va en el layout del sitio: cuenta las páginas vistas y, al abrir una propiedad,
   guarda la altura donde estabas para volver ahí con «Regresar». No pinta nada. */
export function RastreadorNavegacion() {
  const ruta = usePathname();

  useEffect(() => {
    registrarVisita();
  }, [ruta]);

  useEffect(() => {
    const alHacerClic = (e: MouseEvent) => {
      const enlace = (e.target as Element | null)?.closest?.("a[href^='/propiedad/']");
      if (enlace) guardarPosicion();
    };
    document.addEventListener("click", alHacerClic, true);
    return () => document.removeEventListener("click", alHacerClic, true);
  }, []);

  return null;
}
