"use client";

import { useState, type FormEvent } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { whatsappUrl, type Division } from "@/lib/site";

/* =========================================================
   FORMULARIO DE SOLICITUD POR ÁREA
   Todas las áreas piden nombre, teléfono, correo, presupuesto
   y un comentario corto. Cada área agrega sus propios campos.
   Por ahora la solicitud se envía por WhatsApp al número de la
   división; al conectar la base de datos se guardará también ahí.
   ========================================================= */

type Campo =
  | { tipo: "opciones"; nombre: string; etiqueta: string; opciones: string[] }
  | { tipo: "texto"; nombre: string; etiqueta: string; placeholder: string }
  | { tipo: "fecha"; nombre: string; etiqueta: string };

type ConfigArea = {
  asunto: string; // Se usa en el mensaje: "Hola, quiero ___"
  presupuesto: { etiqueta: string; placeholder: string };
  campos: Campo[];
};

const TIPOS_INMUEBLE = ["Casa", "Departamento", "Terreno", "Comercial", "Industrial"];

const AREAS: Record<string, ConfigArea> = {
  albavera: {
    asunto: "comprar una propiedad",
    presupuesto: { etiqueta: "Presupuesto de compra", placeholder: "Ej. $2,500,000" },
    campos: [
      { tipo: "opciones", nombre: "Tipo de inmueble", etiqueta: "Tipo de inmueble", opciones: TIPOS_INMUEBLE },
      { tipo: "texto", nombre: "Zona de interés", etiqueta: "Zona de interés", placeholder: "Colonia o municipio" },
    ],
  },
  "civ-rentas": {
    asunto: "rentar una propiedad",
    presupuesto: { etiqueta: "Presupuesto de renta", placeholder: "Ej. $12,000 al mes" },
    campos: [
      { tipo: "opciones", nombre: "Tipo de renta", etiqueta: "Tipo de renta", opciones: ["Renta anual", "Renta vacacional"] },
      { tipo: "opciones", nombre: "Tipo de inmueble", etiqueta: "Tipo de inmueble", opciones: TIPOS_INMUEBLE },
      { tipo: "texto", nombre: "Zona de interés", etiqueta: "Zona de interés", placeholder: "Colonia o municipio" },
    ],
  },
  immor: {
    asunto: "cotizar una mudanza",
    presupuesto: { etiqueta: "Presupuesto aproximado", placeholder: "Ej. $8,000" },
    campos: [
      { tipo: "texto", nombre: "Origen", etiqueta: "¿Desde dónde?", placeholder: "Colonia y municipio" },
      { tipo: "texto", nombre: "Destino", etiqueta: "¿Hacia dónde?", placeholder: "Colonia y municipio" },
      { tipo: "fecha", nombre: "Fecha deseada", etiqueta: "Fecha deseada" },
    ],
  },
  "asesoria-proyectos": {
    asunto: "solicitar un servicio de construcción o asesoría",
    presupuesto: { etiqueta: "Presupuesto de la obra", placeholder: "Ej. $300,000" },
    campos: [
      {
        tipo: "opciones",
        nombre: "Servicio",
        etiqueta: "Servicio",
        opciones: ["Construcción", "Remodelación", "Mantenimiento", "Proyecto y planos", "Asesoría jurídica o gestoría"],
      },
      { tipo: "texto", nombre: "Ubicación de la obra", etiqueta: "Ubicación de la obra", placeholder: "Colonia o municipio" },
    ],
  },
  aqmen: {
    asunto: "cotizar un proyecto de AQMEN",
    presupuesto: { etiqueta: "Presupuesto aproximado", placeholder: "Ej. $80,000" },
    campos: [
      { tipo: "opciones", nombre: "Proyecto", etiqueta: "Proyecto", opciones: ["Cocina integral", "Clóset", "Cocina y clóset"] },
      { tipo: "texto", nombre: "Ubicación", etiqueta: "Ubicación", placeholder: "Colonia o municipio" },
    ],
  },
  financiamiento: {
    asunto: "información sobre financiamiento",
    presupuesto: { etiqueta: "Monto que necesitas", placeholder: "Ej. $1,500,000" },
    campos: [
      { tipo: "opciones", nombre: "Destino del crédito", etiqueta: "¿Para qué es?", opciones: ["Comprar", "Construir", "Remodelar"] },
      {
        tipo: "opciones",
        nombre: "Comprobación de ingresos",
        etiqueta: "¿Cómo compruebas ingresos?",
        opciones: ["Recibos de nómina", "Estados de cuenta", "Declaración de impuestos", "Aún no lo sé"],
      },
    ],
  },
};

const MAX_COMENTARIO = 100;

const campo =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-[0.9375rem] text-white placeholder:text-white/40 outline-none transition focus:border-arena-300 focus:bg-white/[0.11] focus:ring-4 focus:ring-arena-300/15 [color-scheme:dark]";
const flecha =
  "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10";
const etiqueta = "block text-[0.8125rem] font-semibold text-white/85";

export function FormularioArea({ division }: { division: Division }) {
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const config = AREAS[division.slug];
  if (!config) return null;

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const v = (k: string) => String(datos.get(k) ?? "").trim();

    const mensaje = [
      `Hola, quiero ${config.asunto} con *${division.nombre}*.`,
      "",
      `• Nombre: ${v("nombre")}`,
      `• Teléfono: ${v("telefono")}`,
      `• Correo: ${v("correo")}`,
      ...config.campos.map((c) => (v(c.nombre) ? `• ${c.nombre}: ${v(c.nombre)}` : "")),
      v("presupuesto") ? `• ${config.presupuesto.etiqueta}: ${v("presupuesto")}` : "",
      comentario.trim() ? `• Comentario: ${comentario.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(mensaje, division.telefono), "_blank", "noopener");
    setEnviado(true);
  }

  return (
    <form onSubmit={enviar} className="rounded-[1.6rem] border border-white/15 bg-marino-950/40 p-5 shadow-2xl shadow-black/20 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <label className={etiqueta}>
          Nombre completo *
          <input name="nombre" required autoComplete="name" className={campo} placeholder="Tu nombre" />
        </label>
        <label className={etiqueta}>
          Teléfono *
          <input name="telefono" required type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+ ()-]{10,}" className={campo} placeholder="777 123 4567" />
        </label>
        <label className={`${etiqueta} sm:col-span-2`}>
          Correo electrónico *
          <input name="correo" required type="email" autoComplete="email" className={campo} placeholder="tucorreo@ejemplo.com" />
        </label>

        {config.campos.map((c) => (
          <label key={c.nombre} className={etiqueta}>
            {c.etiqueta}
            {c.tipo === "opciones" ? (
              <select name={c.nombre} defaultValue="" className={`${campo} ${flecha}`}>
                <option value="" className="text-tinta">Selecciona…</option>
                {c.opciones.map((o) => (
                  <option key={o} className="text-tinta">{o}</option>
                ))}
              </select>
            ) : c.tipo === "fecha" ? (
              <input name={c.nombre} type="date" className={campo} />
            ) : (
              <input name={c.nombre} className={campo} placeholder={c.placeholder} />
            )}
          </label>
        ))}

        <label className={etiqueta}>
          {config.presupuesto.etiqueta}
          <input name="presupuesto" inputMode="numeric" className={campo} placeholder={config.presupuesto.placeholder} />
        </label>
      </div>

      <label className={`${etiqueta} mt-4 sm:mt-5`}>
        <span className="flex justify-between gap-3">
          <span>
            Comentario <span className="font-normal text-white/45">(opcional)</span>
          </span>
          <span className="font-normal text-white/45" aria-live="polite">
            {comentario.length}/{MAX_COMENTARIO}
          </span>
        </span>
        <textarea
          name="comentario"
          rows={2}
          maxLength={MAX_COMENTARIO}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className={`${campo} resize-none`}
          placeholder="Algo más que debamos saber"
        />
      </label>

      <label className="mt-4 flex items-start gap-3 text-[0.8125rem] sm:mt-5 leading-5 text-white/70">
        <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-arena-300" />
        Acepto que Grupo Comalba me contacte para dar seguimiento a mi solicitud.
      </label>

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-dorado-500 px-6 py-3.5 sm:mt-6 sm:py-4 text-[0.9375rem] font-bold text-marino-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-dorado-400 active:translate-y-0"
      >
        <Send size={17} /> Enviar solicitud
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/50" aria-live="polite">
        <ShieldCheck size={14} />
        {enviado ? "¡Listo! Se abrió WhatsApp con tu solicitud." : "Se enviará por WhatsApp. Tus datos solo se usan para contactarte."}
      </p>
    </form>
  );
}
