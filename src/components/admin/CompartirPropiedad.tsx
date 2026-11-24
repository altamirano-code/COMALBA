"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, ExternalLink, Link2, Loader2, RefreshCw, X } from "lucide-react";
import { alertasDeMarca, estadoEnlace, generarEnlace, guardarEnlace, urlEnlace, type Enlace, type EstadoEnlace } from "@/lib/enlaces";
import { precioTexto, type Publicacion } from "@/lib/publicaciones";

/* =========================================================
   COMPARTIR PROPIEDAD (panel)
   Genera el enlace sin datos de la inmobiliaria y controla qué
   muestra: activo, vencimiento, precio, ubicación, si las aliadas
   pueden compartirlo desde la página pública y una nota adicional.
   ========================================================= */

const ESTADOS: Record<EstadoEnlace, { texto: string; clase: string }> = {
  activo: { texto: "Activo", clase: "bg-emerald-100 text-emerald-800" },
  desactivado: { texto: "Desactivado", clase: "bg-neutral-200 text-neutral-700" },
  vencido: { texto: "Vencido", clase: "bg-amber-100 text-amber-800" },
};

/* La fecha se guarda al final del día elegido (hora local) */
const aFechaInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const deFechaInput = (valor: string) => (valor ? new Date(`${valor}T23:59:59`).toISOString() : null);

export function CompartirPropiedad({
  publicacion: p,
  enlace: inicial,
  onCerrar,
  onCambio,
}: {
  publicacion: Publicacion;
  enlace: Enlace | undefined;
  onCerrar: () => void;
  onCambio: (e: Enlace) => void;
}) {
  const [enlace, setEnlace] = useState<Enlace | undefined>(inicial);
  const [borrador, setBorrador] = useState<Enlace | undefined>(inicial);
  const [trabajando, setTrabajando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  const alertas = alertasDeMarca(p, borrador?.notaAdicional ?? "");
  const sinGuardar = JSON.stringify(enlace) !== JSON.stringify(borrador);
  const noVisible = !p.publicada || Boolean(p.eliminadaEn);

  async function ejecutar(accion: () => Promise<Enlace>, mensaje: string) {
    setTrabajando(true);
    setAviso("");
    try {
      const nuevo = await accion();
      setEnlace(nuevo);
      setBorrador(nuevo);
      onCambio(nuevo);
      setAviso(mensaje);
    } catch {
      setAviso("No se pudo completar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setTrabajando(false);
    }
  }

  async function copiar() {
    if (!enlace) return;
    try {
      await navigator.clipboard.writeText(urlEnlace(enlace.codigo));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setAviso(`Copia este enlace: ${urlEnlace(enlace.codigo)}`);
    }
  }

  function regenerar() {
    if (!enlace) return;
    if (!confirm("Se creará un enlace nuevo y el actual dejará de funcionar para quien ya lo tenga. ¿Continuar?")) return;
    ejecutar(() => generarEnlace(p.id, borrador), "Enlace nuevo generado. El anterior ya no funciona.");
  }

  const cambiar = <K extends keyof Enlace>(campo: K, valor: Enlace[K]) => setBorrador((b) => (b ? { ...b, [campo]: valor } : b));
  const estado = enlace ? ESTADOS[estadoEnlace(enlace)] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-marino-950/50 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="compartir-titulo" onClick={onCerrar}>
      <div onClick={(e) => e.stopPropagation()} className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-marfil shadow-2xl sm:rounded-3xl ${enlace ? "max-w-5xl" : "max-w-2xl"}`}>
        <header className="flex items-start justify-between gap-4 border-b border-marino-950/10 bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-piedra">Compartir propiedad · {p.clave}</p>
            <h2 id="compartir-titulo" className="truncate font-display text-2xl font-semibold text-marino-900">
              {p.titulo || "Sin título"}
            </h2>
            <p className="mt-0.5 text-[0.9375rem] text-piedra">{precioTexto(p)}</p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="grid size-10 shrink-0 place-items-center rounded-full text-piedra transition hover:bg-marfil hover:text-marino-900">
            <X size={20} />
          </button>
        </header>

        <div className={`flex-1 overflow-y-auto p-5 sm:p-6 ${enlace && borrador ? "grid gap-5 lg:grid-cols-2" : "space-y-4"}`}>
          {/* Izquierda: qué es, el enlace y los avisos */}
          <div className="min-w-0 space-y-4">
            <p className="text-[0.9375rem] leading-6 text-piedra">
              Abre una página limpia con fotos, descripción y características, sin logotipos, nombres, teléfonos ni correos de Grupo Comalba. Se puede
              compartir por WhatsApp, Facebook o donde sea.
            </p>

            {noVisible && (
              <p className="rounded-xl bg-amber-50 p-3 text-[0.9375rem] text-amber-900 ring-1 ring-amber-200">
                La publicación está {p.eliminadaEn ? "en la papelera" : "oculta"}: el enlace no mostrará nada hasta que se publique.
              </p>
            )}

            {!enlace || !borrador ? (
              <button
                type="button"
                disabled={trabajando}
                onClick={() => ejecutar(() => generarEnlace(p.id), "Enlace generado.")}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-marino-900 px-5 text-[0.9375rem] font-bold text-white transition hover:bg-marino-700 disabled:opacity-60"
              >
                {trabajando ? <Loader2 size={17} className="animate-spin" /> : <Link2 size={17} />}
                Generar enlace sin datos de la inmobiliaria
              </button>
            ) : (
              <div className="rounded-2xl bg-white p-4 ring-1 ring-marino-950/8">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[0.9375rem] font-semibold text-marino-900">Enlace</span>
                  {estado && <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${estado.clase}`}>{estado.texto}</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={urlEnlace(enlace.codigo)}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="Enlace sin datos"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-marino-950/15 bg-marfil px-3 font-mono text-[0.9375rem] text-marino-900"
                  />
                  <button
                    type="button"
                    onClick={copiar}
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-marino-900 px-4 text-[0.9375rem] font-bold text-white transition hover:bg-marino-700"
                  >
                    {copiado ? <Check size={16} /> : <Copy size={16} />} {copiado ? "Copiado" : "Copiar enlace"}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem]">
                  <a href={`/p/${enlace.codigo}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-marino-900 hover:underline">
                    <ExternalLink size={14} /> Ver como lo verá el cliente
                  </a>
                  <button type="button" onClick={regenerar} disabled={trabajando} className="inline-flex items-center gap-1.5 font-semibold text-piedra hover:text-marino-900">
                    <RefreshCw size={14} /> Generar uno nuevo
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white p-4 ring-1 ring-marino-950/8">
              <p className="flex items-center gap-2 text-[0.9375rem] font-semibold text-marino-900">
                <AlertTriangle size={16} className="text-amber-600" /> Antes de compartir
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] text-piedra">
                <li>Revisa que las fotos no tengan marcas de agua, letreros ni nada que identifique a la empresa.</li>
                {alertas.map((a) => (
                  <li key={a} className="text-amber-800">
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {aviso && (
              <p role="status" className="text-[0.9375rem] font-medium text-marino-900">
                {aviso}
              </p>
            )}
          </div>

          {/* Derecha: qué muestra el enlace */}
          {enlace && borrador && (
            <div className="min-w-0 space-y-4">
              <div className="divide-y divide-marino-950/8 rounded-2xl bg-white ring-1 ring-marino-950/8">
                <Interruptor etiqueta="Enlace activo" detalle="Apagado, se verá «Esta propiedad ya no está disponible»." valor={borrador.activo} onCambio={(v) => cambiar("activo", v)} />
                <Interruptor etiqueta="Mostrar precio" detalle="Apagado, el precio aparece como «$$$»." valor={borrador.mostrarPrecio} onCambio={(v) => cambiar("mostrarPrecio", v)} />
                <Interruptor
                  etiqueta="Mostrar ubicación"
                  detalle="Solo colonia, municipio y estado. Nunca el mapa ni la dirección exacta."
                  valor={borrador.mostrarUbicacion}
                  onCambio={(v) => cambiar("mostrarUbicacion", v)}
                />
                <Interruptor
                  etiqueta="Permitir que aliadas lo compartan"
                  detalle="Muestra «Compartir sin datos» en la página pública de la propiedad."
                  valor={borrador.permitirAliadas}
                  onCambio={(v) => cambiar("permitirAliadas", v)}
                />
                <label className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="block text-[0.9375rem] font-semibold text-marino-900">Fecha de vencimiento</span>
                    <span className="block text-sm text-piedra">Opcional. Deja de funcionar al terminar ese día.</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <input
                      type="date"
                      value={aFechaInput(borrador.venceEn)}
                      min={aFechaInput(new Date().toISOString())}
                      onChange={(e) => cambiar("venceEn", deFechaInput(e.target.value))}
                      className="h-10 rounded-lg border border-marino-950/15 px-2 text-[0.9375rem]"
                    />
                    {borrador.venceEn && (
                      <button type="button" onClick={() => cambiar("venceEn", null)} className="text-sm font-semibold text-piedra hover:text-marino-900">
                        Quitar
                      </button>
                    )}
                  </span>
                </label>
              </div>

              <label className="block rounded-2xl bg-white p-4 ring-1 ring-marino-950/8">
                <span className="block text-[0.9375rem] font-semibold text-marino-900">Información adicional</span>
                <span className="block text-sm text-piedra">Aparece en la ficha, debajo de la descripción. Solo para este enlace.</span>
                <textarea
                  value={borrador.notaAdicional}
                  onChange={(e) => cambiar("notaAdicional", e.target.value)}
                  rows={2}
                  maxLength={600}
                  placeholder="Ej.: Entrega inmediata. Acepta crédito Infonavit."
                  className="mt-2 w-full resize-none rounded-lg border border-marino-950/15 px-3 py-2 text-base"
                />
              </label>
            </div>
          )}
        </div>

        {enlace && borrador && (
          <footer className="flex items-center justify-end gap-2 border-t border-marino-950/10 bg-white px-6 py-4">
            <button type="button" onClick={onCerrar} className="h-11 rounded-xl px-4 text-[0.9375rem] font-semibold text-piedra hover:text-marino-900">
              Cerrar
            </button>
            <button
              type="button"
              disabled={!sinGuardar || trabajando}
              onClick={() => ejecutar(() => guardarEnlace(borrador), "Cambios guardados.")}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-marino-900 px-5 text-[0.9375rem] font-bold text-white transition hover:bg-marino-700 disabled:opacity-40"
            >
              {trabajando && <Loader2 size={16} className="animate-spin" />} Guardar cambios
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

function Interruptor({ etiqueta, detalle, valor, onCambio }: { etiqueta: string; detalle: string; valor: boolean; onCambio: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span>
        <span className="block text-[0.9375rem] font-semibold text-marino-900">{etiqueta}</span>
        <span className="block text-sm text-piedra">{detalle}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={valor}
        aria-label={etiqueta}
        onClick={() => onCambio(!valor)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${valor ? "bg-marino-900" : "bg-marino-950/20"}`}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${valor ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

