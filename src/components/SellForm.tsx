"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck, Send } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import { registrarLead } from "@/lib/solicitudes";

const OPERACIONES = ["Vender", "Rentar", "Valuar"] as const;
type Operacion = (typeof OPERACIONES)[number];

/* Quién atiende al propietario: rentar es de CIV Rentas; vender y valuar, de ALBAVERA */
const AREA: Record<Operacion, string> = { Vender: "albavera", Rentar: "civ-rentas", Valuar: "albavera" };
const MAX_DETALLES = 100; // Cuestionario 5.3: cuadro de texto de 100 caracteres

const TIPOS = ["Casa", "Departamento", "Terreno", "Local comercial", "Oficina", "Bodega", "Otro"];

const campo =
  "mt-2 w-full rounded-lg border border-white/15 bg-white/[0.07] px-4 py-3 text-base sm:py-3.5 text-white placeholder:text-white/55 outline-none transition focus:border-arena-300 focus:bg-white/[0.11] focus:ring-4 focus:ring-arena-300/15";
const etiqueta = "block text-[0.8125rem] font-semibold text-white/85";

/* Formulario "Cuéntanos sobre tu propiedad": arma el mensaje y lo envía por WhatsApp */
export function SellForm() {
  const [operacion, setOperacion] = useState<Operacion>("Vender");
  const [enviado, setEnviado] = useState(false);

  /* "Solicitar valuación" preselecciona Valuar de dos formas:
     - por la dirección (#valuar), que funciona aunque el toque llegue antes de que cargue el JavaScript;
     - por el clic en botones con data-operacion, para cuando la dirección ya era #valuar. */
  useEffect(() => {
    const desdeHash = () => {
      if (window.location.hash === "#valuar") setOperacion("Valuar");
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-operacion]");
      const valor = el?.dataset.operacion as Operacion | undefined;
      if (valor && OPERACIONES.includes(valor)) setOperacion(valor);
    };
    desdeHash();
    window.addEventListener("hashchange", desdeHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", desdeHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const v = (k: string) => String(datos.get(k) ?? "").trim();
    if (v("sitio_web")) return setEnviado(true); // Campo trampa: solo un robot lo llena

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

    // WhatsApp se abre antes de esperar a la base: si no, el navegador bloquea la ventana
    window.open(whatsappUrl(mensaje), "_blank", "noopener");
    setEnviado(true);
    registrarLead({
      formulario: "propietario",
      area: AREA[operacion],
      nombre: v("nombre"),
      telefono: v("telefono"),
      correo: v("correo"),
      mensaje: v("detalles"),
      datos: [
        { etiqueta: "Quiere", valor: operacion },
        { etiqueta: "Tipo de propiedad", valor: v("tipo") },
        { etiqueta: "Ubicación", valor: v("ubicacion") },
      ],
    });
  }

  return (
    <form onSubmit={enviar} className="relative rounded-xl border border-white/15 bg-marino-950/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <label aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        Sitio web
        <input name="sitio_web" tabIndex={-1} autoComplete="off" />
      </label>
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
        <textarea name="detalles" rows={3} maxLength={MAX_DETALLES} className={`${campo} resize-none`} placeholder="Recámaras, m², estado de la propiedad, etc." />
      </label>

      <label className="mt-4 flex items-start gap-3 text-[0.8125rem] sm:mt-5 leading-5 text-white/70">
        <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-arena-300" />
        Acepto que Grupo Comalba me contacte para dar seguimiento a mi solicitud.
      </label>

      <button
        type="submit"
        className="boton boton-dorado mt-5 w-full sm:mt-6"
      >
        <Send size={17} /> Enviar solicitud por WhatsApp
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/65" aria-live="polite">
        <ShieldCheck size={14} />
        {enviado ? "¡Listo! Recibimos tu solicitud y se abrió WhatsApp." : "Tus datos solo se usan para contactarte."}
      </p>
    </form>
  );
}
