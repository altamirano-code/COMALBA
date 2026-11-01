"use client";

import { useEffect, useState } from "react";
import { publicacionesIniciales, type Publicacion } from "@/lib/publicaciones";

/* =========================================================
   ALMACÉN DE PUBLICACIONES
   Versión temporal: guarda en el navegador (IndexedDB), así que
   lo publicado solo se ve en el mismo navegador donde se capturó.
   Cuando se elija la base de datos, solo se reemplaza el cuerpo de
   estas funciones por llamadas al servidor; el panel y las páginas
   no cambian.
   ========================================================= */

const BD = "grupo-comalba";
const TABLA = "publicaciones";
const META = "meta";
const canal = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("comalba-publicaciones") : null;

let conexion: Promise<IDBDatabase> | null = null;

function abrir() {
  conexion ??= new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(BD, 1);
    solicitud.onupgradeneeded = () => {
      solicitud.result.createObjectStore(TABLA, { keyPath: "id" });
      solicitud.result.createObjectStore(META);
    };
    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => {
      conexion = null;
      reject(solicitud.error);
    };
  });
  return conexion;
}

async function operar<T>(tabla: string, modo: IDBTransactionMode, accion: (t: IDBObjectStore) => IDBRequest<T>) {
  const bd = await abrir();
  return new Promise<T>((resolve, reject) => {
    const solicitud = accion(bd.transaction(tabla, modo).objectStore(tabla));
    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

/* La primera vez carga las publicaciones de ejemplo (solo una vez, aunque luego se borren) */
async function sembrar() {
  if (await operar(META, "readonly", (t) => t.get("sembrado"))) return;
  for (const p of publicacionesIniciales) await operar(TABLA, "readwrite", (t) => t.put(p));
  await operar(META, "readwrite", (t) => t.put(true, "sembrado"));
}

const avisar = () => canal?.postMessage("cambio");

/* Todas, incluidas ocultas y en papelera (para el panel). Más recientes primero. */
export async function listarPublicaciones(): Promise<Publicacion[]> {
  await sembrar();
  const todas = await operar<Publicacion[]>(TABLA, "readonly", (t) => t.getAll());
  return todas.sort((a, b) => b.actualizadaEn.localeCompare(a.actualizadaEn));
}

export async function guardarPublicacion(p: Publicacion) {
  await operar(TABLA, "readwrite", (t) => t.put({ ...p, actualizadaEn: new Date().toISOString() }));
  avisar();
}

export async function eliminarDefinitivo(id: string) {
  await operar(TABLA, "readwrite", (t) => t.delete(id));
  avisar();
}

/* Publicaciones visibles para el público; se actualiza si el panel guarda cambios en otra pestaña */
export function usePublicacionesPublicas() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const cargar = () =>
      listarPublicaciones()
        .then((todas) => activo && setPublicaciones(todas.filter((p) => p.publicada && !p.eliminadaEn)))
        .catch(() => activo && setPublicaciones(publicacionesIniciales))
        .finally(() => activo && setCargando(false));
    cargar();
    canal?.addEventListener("message", cargar);
    return () => {
      activo = false;
      canal?.removeEventListener("message", cargar);
    };
  }, []);

  return { publicaciones, cargando };
}
