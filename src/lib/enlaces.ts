"use client";

import type { Publicacion } from "@/lib/publicaciones";
import { supabaseNavegador } from "@/lib/supabase/cliente";
import { supabaseConfigurado } from "@/lib/supabase/config";

/* =========================================================
   ENLACES SIN DATOS (tabla enlaces_compartidos)
   Un enlace por publicación. Solo el equipo con sesión puede
   leerlos o cambiarlos (RLS). El público ve la ficha a través
   de la función ficha_compartida.
   ========================================================= */

export type Enlace = {
  publicacionId: string;
  codigo: string;
  activo: boolean;
  venceEn: string | null;
  mostrarPrecio: boolean;
  mostrarUbicacion: boolean;
  permitirAliadas: boolean;
  notaAdicional: string;
  creadoEn: string;
};

type FilaEnlace = {
  publicacion_id: string;
  codigo: string;
  activo: boolean;
  vence_en: string | null;
  mostrar_precio: boolean;
  mostrar_ubicacion: boolean;
  permitir_aliadas: boolean;
  nota_adicional: string;
  creado_en: string;
};

const deFila = (f: FilaEnlace): Enlace => ({
  publicacionId: f.publicacion_id,
  codigo: f.codigo,
  activo: f.activo,
  venceEn: f.vence_en,
  mostrarPrecio: f.mostrar_precio,
  mostrarUbicacion: f.mostrar_ubicacion,
  permitirAliadas: f.permitir_aliadas,
  notaAdicional: f.nota_adicional,
  creadoEn: f.creado_en,
});

/* 10 caracteres sin letras confusas (0/O, 1/l/I): ~50 bits, imposible de adivinar */
const ALFABETO = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
export function generarCodigo(largo = 10) {
  const azar = crypto.getRandomValues(new Uint32Array(largo));
  return Array.from(azar, (n) => ALFABETO[n % ALFABETO.length]).join("");
}

export type EstadoEnlace = "activo" | "desactivado" | "vencido";
export function estadoEnlace(e: Enlace): EstadoEnlace {
  if (!e.activo) return "desactivado";
  if (e.venceEn && new Date(e.venceEn) <= new Date()) return "vencido";
  return "activo";
}

export const urlEnlace = (codigo: string) => `${window.location.origin}/p/${codigo}`;

export async function listarEnlaces(): Promise<Enlace[]> {
  if (!supabaseConfigurado) return [];
  const { data, error } = await supabaseNavegador().from("enlaces_compartidos").select("*");
  if (error) throw error;
  return (data as FilaEnlace[]).map(deFila);
}

/* Crea el enlace (o lo regenera con un código nuevo; el anterior deja de servir) */
export async function generarEnlace(publicacionId: string, base?: Enlace): Promise<Enlace> {
  const supabase = supabaseNavegador();
  for (let intento = 0; intento < 3; intento++) {
    const fila = {
      publicacion_id: publicacionId,
      codigo: generarCodigo(),
      activo: base?.activo ?? true,
      vence_en: base?.venceEn ?? null,
      mostrar_precio: base?.mostrarPrecio ?? false,
      mostrar_ubicacion: base?.mostrarUbicacion ?? true,
      permitir_aliadas: base?.permitirAliadas ?? true,
      nota_adicional: base?.notaAdicional ?? "",
    };
    const { data, error } = await supabase.from("enlaces_compartidos").upsert(fila).select().single();
    if (!error) return deFila(data as FilaEnlace);
    if (error.code !== "23505") throw error; // 23505 = código repetido: se intenta con otro
  }
  throw new Error("No se pudo generar un código único");
}

export async function guardarEnlace(e: Enlace): Promise<Enlace> {
  const { data, error } = await supabaseNavegador()
    .from("enlaces_compartidos")
    .update({
      activo: e.activo,
      vence_en: e.venceEn,
      mostrar_precio: e.mostrarPrecio,
      mostrar_ubicacion: e.mostrarUbicacion,
      permitir_aliadas: e.permitirAliadas,
      nota_adicional: e.notaAdicional.trim(),
    })
    .eq("publicacion_id", e.publicacionId)
    .select()
    .single();
  if (error) throw error;
  return deFila(data as FilaEnlace);
}

/* Avisos antes de compartir: lo que podría delatar a la empresa en el enlace sin datos */
const MARCAS = /\b(grupo\s+)?comalba\b|\balbavera\b|\bciv(\s+rentas)?\b|\baqmen\b|\bimmor\b/i;
const TELEFONO = /(?:\+?52[\s.-]?)?(?:\d[\s.-]?){10}/;
const CORREO = /[\w.+-]+@[\w-]+\.[\w.]+/;
const URL_TEXTO = /https?:\/\/|www\./i;

export function alertasDeMarca(p: Publicacion, nota: string): string[] {
  const textos: [string, string][] = [
    ["El título", p.titulo],
    ["La descripción", p.descripcion],
    ["Las características", p.extras.join(" · ")],
    ["La nota adicional", nota],
  ];
  const alertas: string[] = [];
  for (const [donde, texto] of textos) {
    if (!texto) continue;
    if (MARCAS.test(texto)) alertas.push(`${donde} menciona el nombre de la empresa o de una división.`);
    if (TELEFONO.test(texto)) alertas.push(`${donde} parece incluir un número de teléfono.`);
    if (CORREO.test(texto)) alertas.push(`${donde} incluye un correo electrónico.`);
    if (URL_TEXTO.test(texto)) alertas.push(`${donde} incluye un enlace a una página.`);
  }
  if (p.video) alertas.push("Revisa que el video no muestre logotipos ni sea de un canal con el nombre de la empresa.");
  return alertas;
}
