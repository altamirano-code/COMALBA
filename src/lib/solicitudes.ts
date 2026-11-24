"use client";

import { supabaseNavegador } from "@/lib/supabase/cliente";
import { supabaseConfigurado } from "@/lib/supabase/config";

/* Solicitudes de visita (tabla solicitudes, ver supabase/02_solicitudes.sql).
   Solo el equipo con sesión las lee y las marca como atendidas. */
export type Solicitud = {
  id: string;
  publicacionId: string | null;
  origen: "sitio" | "enlace";
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  atendida: boolean;
  creadaEn: string;
};

type Fila = {
  id: string;
  publicacion_id: string | null;
  origen: "sitio" | "enlace";
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  atendida: boolean;
  creada_en: string;
};

export async function listarSolicitudes(): Promise<Solicitud[]> {
  if (!supabaseConfigurado) return [];
  const { data, error } = await supabaseNavegador().from("solicitudes").select("*").order("creada_en", { ascending: false });
  if (error) throw error;
  return (data as Fila[]).map((f) => ({
    id: f.id,
    publicacionId: f.publicacion_id,
    origen: f.origen,
    nombre: f.nombre,
    correo: f.correo,
    telefono: f.telefono,
    mensaje: f.mensaje,
    atendida: f.atendida,
    creadaEn: f.creada_en,
  }));
}

export async function marcarAtendida(id: string, atendida: boolean) {
  const { error } = await supabaseNavegador().from("solicitudes").update({ atendida }).eq("id", id);
  if (error) throw error;
}

export async function eliminarSolicitud(id: string) {
  const { error } = await supabaseNavegador().from("solicitudes").delete().eq("id", id);
  if (error) throw error;
}
