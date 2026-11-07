"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck, Send } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

const OPERACIONES = ["Vender", "Rentar", "Valuar"] as const;
type Operacion = (typeof OPERACIONES)[number];

const TIPOS = ["Casa", "Departamento", "Terreno", "Local comercial", "Oficina", "Bodega", "Otro"];

const campo =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base sm:py-3.5 text-white placeholder:text-white/55 outline-none transition focus:border-arena-300 focus:bg-white/[0.11] focus:ring-4 focus:ring-arena-300/15";
const etiqueta = "block text-[13px] font-semibold text-white/85";

/* Formulario "Cuéntanos sobre tu propiedad": arma el mensaje y lo envía por WhatsApp */
export function SellForm() {
  const [operacion, setOperacion] = useState<Operacion>("Vender");
  const [enviado, setEnviado] = useState(false);

  /* Los botones con data-operacion (p. ej. en Valuación) preseleccionan la opción */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-operacion]");
      const valor = el?.dataset.operacion as Operacion | undefined;
      if (valor && OPERACIONES.includes(valor)) setOperacion(valor);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const v = (k: string) => String(datos.get(k) ?? "").trim();

    const mensaje = [
      `Hola, quiero *${operacion.toLowerCase()}* una propiedad.`,
      "",
      `• Nombre: ${v("nombre")}`,
      `• Teléfono: ${v("telefono")}`,
      `• Correo: ${v("correo")}`,
      `• Tipo de propiedad: ${v("tipo")}`,
      `• Ubicación: ${v("ubicacion")}`,
      v("detalles") ? `• Detalles: ${v("detalles")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(mensaje), "_blank", "noopener");
    setEnviado(true);
  }

  return (
    <form onSubmit={enviar} className="rounded-[1.6rem] border border-white/15 bg-marino-950/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <fieldset>
        <legend className={etiqueta}>¿Qué te gustaría hacer?</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-white/[0.07] p-1">
          {OPERACIONES.map((op) => (
            <label key={op} className="relative cursor-pointer">
              <input type="radio" name="operacion" value={op} checked={operacion === op} onChange={() => setOperacion(op)} className="peer sr-only" />
              <span className="block rounded-lg py-2.5 text-center text-sm font-semibold text-white/70 transition peer-checked:bg-arena-300 peer-checked:text-marino-950 peer-focus-visible:ring-2 peer-focus-visible:ring-arena-300 hover:text-white peer-checked:hover:text-marino-950">
                {op}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
        <label className={etiqueta}>
          Nombre completo *
          <input name="nombre" required autoComplete="name" className={campo} placeholder="Tu nombre" />
        </label>
        <label className={etiqueta}>
          Teléfono *
          <input name="telefono" required type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+ ()-]{10,}" className={campo} placeholder="777 123 4567" />
        </label>
      </div>

      <label className={`${etiqueta} mt-4 sm:mt-5`}>
        Correo electrónico *
        <input name="correo" required type="email" autoComplete="email" className={campo} placeholder="tucorreo@ejemplo.com" />
      </label>

      <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
        <label className={etiqueta}>
          Tipo de propiedad *
          <select name="tipo" required defaultValue="" className={`${campo} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
            <option value="" disabled className="text-tinta">Selecciona un tipo…</option>
            {TIPOS.map((t) => (
              <option key={t} className="text-tinta">{t}</option>
            ))}
          </select>
        </label>
        <label className={etiqueta}>
          Ubicación *
          <input name="ubicacion" required className={campo} placeholder="Ciudad, colonia o municipio" />
        </label>
      </div>

      <label className={`${etiqueta} mt-4 sm:mt-5`}>
        Cuéntanos más <span className="font-normal text-white/60">(opcional)</span>
        <textarea name="detalles" rows={3} className={`${campo} resize-none`} placeholder="Recámaras, m², estado de la propiedad, etc." />
      </label>

      <label className="mt-4 flex items-start gap-3 text-[13px] sm:mt-5 leading-5 text-white/70">
        <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-arena-300" />
        Acepto que Grupo Comalba me contacte para dar seguimiento a mi solicitud.
      </label>

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-dorado-500 px-4 py-3.5 sm:mt-6 sm:gap-2.5 sm:px-6 sm:py-4 text-[15px] font-bold text-marino-950 shadow-lg shadow-dorado-600/30 transition hover:-translate-y-0.5 hover:bg-dorado-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arena-300 active:translate-y-0"
      >
        <Send size={17} /> Enviar solicitud por WhatsApp
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/65" aria-live="polite">
        <ShieldCheck size={14} />
        {enviado ? "¡Listo! Se abrió WhatsApp con tu solicitud." : "Tus datos solo se usan para contactarte."}
      </p>
    </form>
  );
}
