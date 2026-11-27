"use client";

import { supabaseNavegador } from "@/lib/supabase/cliente";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { divisiones } from "@/lib/site";
import type { Publicacion } from "@/lib/publicaciones";

/* =========================================================
   SOLICITUDES (leads)
   Tabla solicitudes, ver supabase/02_solicitudes.sql y 03_leads.sql.
   Llegan de cuatro formularios:
   - visita:      «Solicitar una visita» en la ficha de una propiedad.
   - area:        formulario al final de cada división.
   - propietario: «Vender, rentar o valuar» del inicio.
   - mudanza:     cotizador de Transportes IMMOR.
   El público solo registra (funciones registrar_solicitud y
   registrar_lead); el equipo con sesión las lee y las atiende.
   ========================================================= */

export type Formulario = "visita" | "area" | "propietario" | "mudanza";
export type DatoLead = { etiqueta: string; valor: string };

export const FORMULARIOS: Record<Formulario, string> = {
  visita: "Visita a propiedad",
  area: "Formulario del área",
  propietario: "Propietario",
  mudanza: "Cotización de mudanza",
};

export type Solicitud = {
  id: string;
  publicacionId: string | null;
  origen: "sitio" | "enlace";
  formulario: Formulario;
  area: string | null; // slug de la división
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  datos: DatoLead[];
  atendida: boolean;
  creadaEn: string;
  eliminadaEn: string | null; // Con fecha = está en la papelera
};

type Fila = {
  id: string;
  publicacion_id: string | null;
  origen: "sitio" | "enlace";
  formulario?: Formulario | null; // Sin 03_leads.sql la columna no existe
  area?: string | null;
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  datos?: DatoLead[] | null;
  atendida: boolean;
  creada_en: string;
  eliminada_en?: string | null; // Sin 04_papelera_solicitudes.sql la columna no existe
};

export const nombreArea = (slug: string | null) => divisiones.find((d) => d.slug === slug)?.nombre ?? "Sin área";

export async function listarSolicitudes(): Promise<Solicitud[]> {
  if (!supabaseConfigurado) return [];
  const { data, error } = await supabaseNavegador().from("solicitudes").select("*").order("creada_en", { ascending: false });
  if (error) throw error;
  return (data as Fila[]).map((f) => ({
    id: f.id,
    publicacionId: f.publicacion_id,
    origen: f.origen,
    formulario: f.formulario ?? "visita",
    area: f.area ?? null,
    nombre: f.nombre,
    correo: f.correo,
    telefono: f.telefono,
    mensaje: f.mensaje,
    datos: Array.isArray(f.datos) ? f.datos : [],
    atendida: f.atendida,
    creadaEn: f.creada_en,
    eliminadaEn: f.eliminada_en ?? null,
  }));
}

export async function marcarAtendida(id: string, atendida: boolean) {
  const { error } = await supabaseNavegador().from("solicitudes").update({ atendida }).eq("id", id);
  if (error) throw error;
}

/* Papelera: con fecha la manda a la papelera; con null la restaura */
export async function papeleraSolicitud(id: string, enPapelera: boolean) {
  const eliminada_en = enPapelera ? new Date().toISOString() : null;
  const { error } = await supabaseNavegador().from("solicitudes").update({ eliminada_en }).eq("id", id);
  if (error) throw error;
}

/* Borrado definitivo: solo desde la papelera */
export async function eliminarSolicitud(id: string) {
  const { error } = await supabaseNavegador().from("solicitudes").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- Registro público (formularios del sitio) ---------- */
export type NuevoLead = {
  formulario: Exclude<Formulario, "visita">;
  area: string;
  nombre: string;
  correo: string;
  telefono: string;
  mensaje?: string;
  datos: DatoLead[]; // Los vacíos se descartan
};

/* Guarda el lead. Devuelve true si quedó guardado; nunca lanza error,
   para que el formulario siga (y abra WhatsApp) aunque falle la base. */
export async function registrarLead(lead: NuevoLead): Promise<boolean> {
  if (!supabaseConfigurado) return false;
  try {
    const { data, error } = await supabaseNavegador().rpc("registrar_lead", {
      p_formulario: lead.formulario,
      p_area: lead.area,
      p_nombre: lead.nombre,
      p_correo: lead.correo,
      p_telefono: lead.telefono,
      p_mensaje: lead.mensaje ?? "",
      p_datos: lead.datos.filter((d) => d.valor.trim()),
    });
    return !error && data === true;
  } catch {
    return false;
  }
}

/* ---------- Exportar a Excel ----------
   CSV con BOM: Excel lo abre con acentos correctos (cuestionario 5.4 y 9.3). */
export function exportarSolicitudesExcel(lista: Solicitud[], publicaciones: Publicacion[]) {
  const propiedad = (s: Solicitud) => publicaciones.find((p) => p.id === s.publicacionId);
  const columnas: [string, (s: Solicitud) => string][] = [
    ["Fecha", (s) => new Date(s.creadaEn).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })],
    ["Estado", (s) => (s.atendida ? "Atendida" : "Pendiente")],
    ["Área", (s) => nombreArea(s.area)],
    ["Formulario", (s) => FORMULARIOS[s.formulario] + (s.origen === "enlace" ? " (enlace sin datos)" : "")],
    ["Nombre", (s) => s.nombre],
    ["Teléfono", (s) => s.telefono],
    ["Correo", (s) => s.correo],
    ["Clave de propiedad", (s) => propiedad(s)?.clave ?? ""],
    ["Propiedad", (s) => propiedad(s)?.titulo ?? ""],
    ["Detalles", (s) => s.datos.map((d) => `${d.etiqueta}: ${d.valor}`).join(" | ")],
    ["Mensaje", (s) => s.mensaje],
  ];
  // Prefijo ' en celdas que Excel tomaría como fórmula (=, @, o + y - seguidos de algo que no es número, como en "+52 777…")
  const celda = (v: string) => `"${(/^[=@]|^[+-](?![\d\s])/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const filas = [columnas.map(([t]) => celda(t)), ...lista.map((s) => columnas.map(([, f]) => celda(f(s))))].map((f) => f.join(","));
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(new Blob(["﻿" + filas.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  enlace.download = `leads-comalba-${new Date().toISOString().slice(0, 10)}.csv`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}
