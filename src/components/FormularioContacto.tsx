"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import { registrarLead } from "@/lib/solicitudes";

/* =========================================================
   FORMULARIO DE CONTACTO GENERAL (sección Contacto del inicio)
   Nombre, Teléfono (WhatsApp), Correo opcional y Mensaje.
   Como los demás formularios del sitio: abre WhatsApp con el
   mensaje armado y guarda la solicitud en el panel
   (formulario "contacto", ver supabase/06_contacto.sql).
   Pensado para fondo oscuro (azul marino).
   ========================================================= */

const etiqueta = "block text-sm font-semibold text-white/85";
const campo =
  "mt-1.5 w-full rounded-lg border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-white placeholder:text-white/45 outline-none transition focus:border-arena-300 focus:ring-4 focus:ring-arena-300/15";

export function FormularioContacto() {
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState("");

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const v = (k: string) => String(datos.get(k) ?? "").trim();
    setNombre(v("nombre"));
    if (v("sitio_web")) return setEnviado(true); // Campo trampa: solo un robot lo llena

    const mensaje = [
      "Hola, me interesa hablar con un asesor de Grupo Comalba.",
      "",
      `• Nombre: ${v("nombre")}`,
      `• Teléfono: ${v("telefono")}`,
      v("correo") ? `• Correo: ${v("correo")}` : "",
      v("mensaje") ? `• Mensaje: ${v("mensaje")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // WhatsApp se abre antes de esperar a la base: si no, el navegador bloquea la ventana
    window.open(whatsappUrl(mensaje), "_blank", "noopener");
    setEnviado(true);
    registrarLead({
      formulario: "contacto",
      area: null,
      nombre: v("nombre"),
      telefono: v("telefono"),
      correo: v("correo"),
      mensaje: v("mensaje"),
      datos: [],
    });
  }

  if (enviado) {
    return (
      <div className="rounded-xl bg-marino-950/40 p-6 text-center ring-1 ring-white/15 sm:p-8">
        <CheckCircle2 size={40} className="mx-auto text-arena-300" />
        <p className="mt-3 font-display text-2xl font-semibold text-white">¡Gracias{nombre ? `, ${nombre.split(" ")[0]}` : ""}!</p>
        <p className="mt-2 text-cuerpo text-white/70">Te contactaremos pronto. Si se abrió WhatsApp, envía el mensaje para atenderte más rápido.</p>
        <button type="button" onClick={() => setEnviado(false)} className="boton boton-contorno mt-5">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="relative rounded-xl bg-marino-950/40 p-6 text-white ring-1 ring-white/15 sm:p-8">
      <label aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        Sitio web
        <input name="sitio_web" tabIndex={-1} autoComplete="off" />
      </label>

      <h3 className="font-display text-2xl font-semibold text-white">Solicitar información</h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className={etiqueta}>
          Nombre completo
          <input name="nombre" required maxLength={120} autoComplete="name" placeholder="Tu nombre" className={campo} />
        </label>
        <label className={etiqueta}>
          Teléfono (WhatsApp)
          <input name="telefono" required type="tel" inputMode="tel" maxLength={40} pattern="[0-9+ ()-]{10,}" autoComplete="tel" placeholder="777 123 4567" className={campo} />
        </label>
      </div>
      <label className={`${etiqueta} mt-4`}>
        Correo <span className="font-normal text-white/50">(opcional)</span>
        <input name="correo" type="email" maxLength={200} autoComplete="email" placeholder="tucorreo@ejemplo.com" className={campo} />
      </label>
      <label className={`${etiqueta} mt-4`}>
        Mensaje
        <textarea name="mensaje" rows={3} maxLength={1000} placeholder="Cuéntanos qué necesitas" className={`${campo} resize-none`} />
      </label>

      <label className="mt-4 flex items-start gap-2.5 text-sm text-white/70">
        <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-arena-300" />
        Acepto que Grupo Comalba me contacte para dar seguimiento a mi solicitud.
      </label>

      <button type="submit" className="boton boton-dorado mt-5 w-full">
        Enviar
      </button>
    </form>
  );
}
