"use client";

import { useEffect, useRef, useState } from "react";
import { logoComalba } from "@/lib/site";

/* Logo oficial de Comalba. Si la imagen remota no carga, usa la copia local. */
export function LogoComalba({ className = "", alt = "Grupo Comalba" }: { className?: string; alt?: string }) {
  const [src, setSrc] = useState(logoComalba.remoto || logoComalba.local);
  const ref = useRef<HTMLImageElement>(null);

  const usarLocal = () => {
    if (src !== logoComalba.local) setSrc(logoComalba.local);
  };

  /* Si la imagen falló antes de que React cargara, onError no se dispara: se revisa aquí */
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) usarLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={src} alt={alt} className={className} decoding="async" onError={usarLocal} />
  );
}
