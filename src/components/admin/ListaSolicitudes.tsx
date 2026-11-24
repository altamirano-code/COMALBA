"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, ExternalLink, Inbox, Link2, Mail, MessageCircle, Phone, RotateCcw, Trash2 } from "lucide-react";
import type { Publicacion } from "@/lib/publicaciones";
import type { Solicitud } from "@/lib/solicitudes";

/* =========================================================
   PANEL → SOLICITUDES
   Interesados que llenaron «Solicitar una visita» en la página
   de una propiedad. Contadores y filtro arriba; cada solicitud
   muestra la persona, la propiedad, cómo contactarla y su mensaje.
   ========================================================= */

type Filtro = "pendientes" | "atendidas" | "todas";

const soloDigitos = (t: string) => t.replace(/\D/g, "");

const relativa = new Intl.RelativeTimeFormat("es-MX", { numeric: "auto" });
function haceCuanto(iso: string) {
  const minutos = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutos) < 60) return relativa.format(minutos, "minute");
  const horas = Math.round(minutos / 60);
  if (Math.abs(horas) < 24) return relativa.format(horas, "hour");
  const dias = Math.round(horas / 24);
  if (Math.abs(dias) < 7) return relativa.format(dias, "day");
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}
const fechaCompleta = (iso: string) => new Date(iso).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" });

const iniciales = (nombre: string) =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

export function ListaSolicitudes({
  solicitudes,
  publicaciones,
  onAtendida,
  onEliminar,
}: {
  solicitudes: Solicitud[];
  publicaciones: Publicacion[];
  onAtendida: (s: Solicitud) => void;
  onEliminar: (s: Solicitud) => void;
}) {
  const pendientes = solicitudes.filter((s) => !s.atendida).length;
  const atendidas = solicitudes.length - pendientes;
  const [filtro, setFiltro] = useState<Filtro>(pendientes ? "pendientes" : "todas");

  const lista = solicitudes.filter((s) => (filtro === "todas" ? true : filtro === "pendientes" ? !s.atendida : s.atendida));

  if (!solicitudes.length) {
    return (
      <div className="grid place-items-center rounded-3xl bg-marfil px-6 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-white text-marino-900 shadow-sm ring-1 ring-marino-950/5">
          <Inbox size={28} strokeWidth={1.6} />
        </span>
        <p className="mt-5 text-lg font-semibold text-marino-900">Todavía no hay solicitudes</p>
        <p className="mt-1.5 max-w-sm text-[0.9375rem] leading-6 text-piedra">
          Aquí llegan las personas que llenan «Solicitar una visita» en la página de una propiedad.
        </p>
      </div>
    );
  }

  const pestanas: { id: Filtro; texto: string; total: number }[] = [
    { id: "pendientes", texto: "Pendientes", total: pendientes },
    { id: "atendidas", texto: "Atendidas", total: atendidas },
    { id: "todas", texto: "Todas", total: solicitudes.length },
  ];

  return (
    <div className="space-y-5">
      {/* Resumen y filtro */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-dorado-500/15 text-dorado-600">
            <Clock size={22} />
          </span>
          <p className="leading-tight">
            <span className="block font-display text-2xl font-semibold text-marino-900">{pendientes}</span>
            <span className="text-sm text-piedra">{pendientes === 1 ? "solicitud por atender" : "solicitudes por atender"}</span>
          </p>
        </div>
        <div role="tablist" aria-label="Filtrar solicitudes" className="flex gap-1 rounded-2xl bg-marfil p-1">
          {pestanas.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={filtro === t.id}
              onClick={() => setFiltro(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filtro === t.id ? "bg-white text-marino-900 shadow-sm" : "text-piedra hover:text-marino-900"
              }`}
            >
              {t.texto}
              <span className={`rounded-full px-2 py-0.5 text-xs ${filtro === t.id ? "bg-marino-900 text-white" : "bg-white/70"}`}>{t.total}</span>
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 ? (
        <p className="rounded-3xl bg-marfil px-6 py-12 text-center text-[0.9375rem] text-piedra">
          {filtro === "pendientes" ? "¡Todo al día! No hay solicitudes pendientes." : "No hay solicitudes en esta vista."}
        </p>
      ) : (
        <ul className="space-y-4">
          {lista.map((s) => (
            <TarjetaSolicitud key={s.id} s={s} p={publicaciones.find((x) => x.id === s.publicacionId)} onAtendida={onAtendida} onEliminar={onEliminar} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TarjetaSolicitud({
  s,
  p,
  onAtendida,
  onEliminar,
}: {
  s: Solicitud;
  p: Publicacion | undefined;
  onAtendida: (s: Solicitud) => void;
  onEliminar: (s: Solicitud) => void;
}) {
  const tel = soloDigitos(s.telefono);
  const telWhats = tel.length === 10 ? `52${tel}` : tel;
  const saludo = encodeURIComponent(`Hola ${s.nombre.split(" ")[0]}, te escribimos por tu solicitud para visitar${p ? ` "${p.titulo}"` : " la propiedad"}.`);

  return (
    <li
      className={`overflow-hidden rounded-3xl bg-white ring-1 transition ${
        s.atendida ? "ring-marino-950/8" : "shadow-[0_12px_40px_-24px_rgba(16,27,45,.45)] ring-dorado-500/35"
      }`}
    >

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Persona, contacto y mensaje */}
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl text-base font-bold ${
                s.atendida ? "bg-marfil text-piedra" : "bg-marino-900 text-arena-200"
              }`}
            >
              {iniciales(s.nombre)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="truncate text-lg font-semibold text-marino-900">{s.nombre}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    s.atendida ? "bg-emerald-50 text-emerald-700" : "bg-dorado-500/15 text-dorado-600"
                  }`}
                >
                  {s.atendida ? <Check size={12} strokeWidth={3} /> : <Clock size={12} strokeWidth={2.5} />}
                  {s.atendida ? "Atendida" : "Pendiente"}
                </span>
                {s.origen === "enlace" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-marfil px-2.5 py-0.5 text-xs font-semibold text-marino-900">
                    <Link2 size={12} /> Enlace sin datos
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-piedra" title={fechaCompleta(s.creadaEn)}>
                {haceCuanto(s.creadaEn)}
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div className="mt-4 flex flex-wrap gap-2">
            {s.telefono && (
              <a
                href={`tel:${tel}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-marfil px-3.5 text-sm font-semibold text-marino-900 transition hover:bg-marino-900 hover:text-white"
              >
                <Phone size={15} /> {s.telefono}
              </a>
            )}
            {tel.length >= 10 && (
              <a
                href={`https://wa.me/${telWhats}?text=${saludo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#25d366]/12 px-3.5 text-sm font-semibold text-[#128c4a] transition hover:bg-[#25d366] hover:text-white"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
            {s.correo && (
              <a
                href={`mailto:${s.correo}`}
                className="inline-flex h-10 min-w-0 items-center gap-2 rounded-xl bg-marfil px-3.5 text-sm font-semibold text-marino-900 transition hover:bg-marino-900 hover:text-white"
              >
                <Mail size={15} className="shrink-0" /> <span className="truncate">{s.correo}</span>
              </a>
            )}
          </div>

          {s.mensaje && (
            <blockquote className="mt-4 rounded-2xl border-l-4 border-arena-300 bg-marfil/70 px-4 py-3 text-[0.9375rem] leading-6 text-tinta">
              <p className="whitespace-pre-line">{s.mensaje}</p>
            </blockquote>
          )}
        </div>

        {/* Propiedad y acciones */}
        <div className="flex flex-col gap-3 lg:border-l lg:border-marino-950/8 lg:pl-5">
          {p ? (
            <Link
              href={`/propiedad/${p.id}?sinIntro=1`}
              target="_blank"
              className="group flex items-center gap-3 rounded-2xl bg-marfil p-2.5 transition hover:bg-crema"
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-crema">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.fotos[0] && <img src={p.fotos[0]} alt="" className="h-full w-full object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs font-semibold text-piedra">{p.clave}</span>
                <span className="line-clamp-2 text-sm font-semibold leading-snug text-marino-900">{p.titulo}</span>
              </span>
              <ExternalLink size={15} className="shrink-0 text-piedra transition group-hover:text-marino-900" />
            </Link>
          ) : (
            <p className="rounded-2xl bg-marfil p-3 text-sm text-piedra">La propiedad ya no existe.</p>
          )}

          <div className="mt-auto flex gap-2">
            <button
              type="button"
              onClick={() => onAtendida(s)}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
                s.atendida ? "bg-marfil text-marino-900 hover:bg-crema" : "bg-marino-900 text-white hover:bg-marino-700"
              }`}
            >
              {s.atendida ? <RotateCcw size={16} /> : <Check size={16} strokeWidth={2.5} />}
              {s.atendida ? "Marcar pendiente" : "Marcar atendida"}
            </button>
            <button
              type="button"
              onClick={() => onEliminar(s)}
              aria-label={`Eliminar la solicitud de ${s.nombre}`}
              title="Eliminar solicitud"
              className="grid size-11 shrink-0 place-items-center rounded-xl text-piedra ring-1 ring-marino-950/10 transition hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
