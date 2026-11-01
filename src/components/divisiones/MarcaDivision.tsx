import Image from "next/image";
import { Landmark } from "lucide-react";
import type { Division } from "@/lib/site";

/* Logo de la división sobre su placa blanca. Sin logo (Financiamiento) se arma con ícono y nombre.
   "ajustable": dentro de un contenedor @container angosto, el ícono pasa arriba del nombre para no desbordarse. */
export function MarcaDivision({ division, className = "", ajustable = false }: { division: Division; className?: string; ajustable?: boolean }) {
  if (!division.logo && ajustable) {
    return (
      <span className={`flex max-w-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-white px-2 py-2 text-center text-marino-900 @[13rem]:flex-row @[13rem]:gap-3 @[13rem]:px-4 @[13rem]:text-left ${className}`}>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-marino-900 text-arena-200 @[13rem]:size-11 @[13rem]:rounded-xl">
          <Landmark className="size-4 @[13rem]:size-[22px]" strokeWidth={1.6} />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold @[8rem]:text-base @[13rem]:text-xl">Financiamiento</span>
          <span className="hidden text-xs font-semibold text-piedra @[13rem]:block">Inmobiliario</span>
        </span>
      </span>
    );
  }

  if (!division.logo) {
    return (
      <span className={`inline-flex min-w-max items-center gap-3 whitespace-nowrap rounded-2xl bg-white px-4 py-3 text-marino-900 ${className}`}>
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
