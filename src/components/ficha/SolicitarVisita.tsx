"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabaseNavegador } from "@/lib/supabase/cliente";

/* =========================================================
   SOLICITAR UNA VISITA (columna derecha de la ficha)
   Solo en la página de la propiedad dentro del sitio (el enlace
   sin datos no lleva formulario). Guarda los datos del interesado
   en Supabase (función registrar_solicitud) y el equipo los ve
   en el panel → Solicitudes.
   ========================================================= */

type Props = { publicacionId: string; whatsapp?: string };

export function SolicitarVisita({ publicacionId, whatsapp }: Props) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [trampa, setTrampa] = useState(""); // Campo oculto: si un robot lo llena, no se envía
  const [estado, setEstado] = useState<"listo" | "enviando" | "enviado" | "error">("listo");
  const [aviso, setAviso] = useState("");

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setAviso("");
    if (!correo.trim() && !telefono.trim()) {
      setAviso("Déjanos un correo o un teléfono para poder contactarte.");
      return;
    }
    if (trampa) {
      setEstado("enviado");
      return;
    }
    setEstado("enviando");
    try {
      const { data, error } = await supabaseNavegador().rpc("registrar_solicitud", {
        p_publicacion: publicacionId,
        p_codigo: null,
        p_nombre: nombre,
        p_correo: correo,
        p_telefono: telefono,
        p_mensaje: mensaje,
      });
      if (error || !data) throw error ?? new Error("No se guardó");
      setEstado("enviado");
    } catch {
      setEstado("error");
      setAviso("No se pudo enviar. Revisa tu conexión e intenta de nuevo.");
    }
  }

  const tarjeta = "rounded-3xl bg-white/75 p-6 ring-1 ring-black/[0.06] backdrop-blur-sm sm:p-7";

  if (estado === "enviado") {
    return (
      <div className={`${tarjeta} text-center`}>
        <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
        <h2 className="mt-3 text-xl font-bold text-neutral-950">¡Solicitud enviada!</h2>
        <p className="mt-2 text-[0.9375rem] leading-7 text-neutral-600">Gracias, {nombre.trim().split(" ")[0]}. Te contactaremos pronto para agendar la visita.</p>
      </div>
    );
  }

  const entrada =
    "mt-1.5 h-12 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-base font-normal text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-black/5";

  return (
    <form onSubmit={enviar} className={`${tarjeta} relative`}>
      <h2 className="text-xl font-bold text-neutral-950 sm:text-2xl">Solicitar una visita</h2>
      <label className="mt-5 block text-sm font-semibold text-neutral-900">
        Nombre completo
        <input required maxLength={120} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Tu nombre" className={entrada} />
      </label>
      <label className="mt-4 block text-sm font-semibold text-neutral-900">
        Correo electrónico
        <input type="email" maxLength={200} value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" placeholder="tucorreo@ejemplo.com" className={entrada} />
      </label>
      <label className="mt-4 block text-sm font-semibold text-neutral-900">
        Teléfono
        <input type="tel" maxLength={40} value={telefono} onChange={(e) => setTelefono(e.target.value)} autoComplete="tel" placeholder="10 dígitos" className={entrada} />
      </label>
      <label className="mt-4 block text-sm font-semibold text-neutral-900">
        Mensaje <span className="font-normal text-neutral-500">(opcional)</span>
        <textarea
          maxLength={1000}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          placeholder="¿Qué día y horario te acomodan?"
          className={`${entrada} h-auto resize-none py-3`}
        />
      </label>
      <label aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        Sitio web
        <input tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
      </label>

      {aviso && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">
          {aviso}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
      >
        {estado === "enviando" && <Loader2 size={16} className="animate-spin" />} Solicitar visita
      </button>

      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-3 block text-center text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-950 hover:underline">
          ¿Prefieres WhatsApp? Escríbenos
        </a>
      )}
    </form>
  );
}
