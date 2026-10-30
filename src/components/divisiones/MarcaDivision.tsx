import Image from "next/image";
import { Landmark } from "lucide-react";
import type { Division } from "@/lib/site";

/* Logo de la división sobre su placa blanca. Sin logo (Financiamiento) se arma con ícono y nombre. */
export function MarcaDivision({ division, className = "" }: { division: Division; className?: string }) {
  if (!division.logo) {
    return (
      <span className={`inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-marino-900 ${className}`}>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-marino-900 text-arena-200">
          <Landmark size={22} strokeWidth={1.6} />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-xl font-semibold">Financiamiento</span>
          <span className="block text-xs font-semibold text-piedra">Inmobiliario</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white p-3 ${className}`}>
      <Image src={division.logo} alt={division.nombre} width={360} height={220} className="h-auto max-h-full w-auto max-w-full object-contain" />
    </span>
  );
}
