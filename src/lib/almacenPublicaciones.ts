"use client";

import { useEffect, useState } from "react";
import { publicacionesIniciales, type Publicacion } from "@/lib/publicaciones";
import { supabaseNavegador } from "@/lib/supabase/cliente";
import { BUCKET_FOTOS, supabaseConfigurado } from "@/lib/supabase/config";
import { aFila, deFila, type FilaPublicacion } from "@/lib/filaPublicacion";
import { esRegreso, restaurarPosicion } from "@/lib/navegacion";

/* =========================================================
   ALMACÉN DE PUBLICACIONES (Supabase)
   Tabla "publicaciones" + fotos en el bucket "fotos".
   Qué puede leer o escribir cada quien lo deciden las políticas
   RLS de supabase/esquema.sql: el público solo ve lo publicado;
   el equipo con sesión ve y edita todo.
   Sin Supabase configurado se muestran las publicaciones de ejemplo.
   ========================================================= */

const canal = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("comalba-publicaciones") : null;
const avisar = () => canal?.postMessage("cambio");

/* Todas las que la sesión actual puede ver (el panel ve también ocultas y papelera). Más recientes primero. */
export async function listarPublicaciones(): Promise<Publicacion[]> {
  if (!supabaseConfigurado) return publicacionesIniciales;
  const { data, error } = await supabaseNavegador().from("publicaciones").select("*").order("actualizada_en", { ascending: false });
  if (error) throw error;
  return (data as FilaPublicacion[]).map(deFila);
}

/* Las fotos nuevas llegan del editor como data URL (JPEG ya reducido): se suben a Storage
   con un nombre aleatorio, así la URL pública no dice nada de la empresa. */
async function subirFotos(fotos: string[]) {
  const supabase = supabaseNavegador();
  return Promise.all(
    fotos.map(async (foto) => {
      if (!foto.startsWith("data:")) return foto;
      const archivo = await (await fetch(foto)).blob();
      const ruta = `${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from(BUCKET_FOTOS).upload(ruta, archivo, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
      return supabase.storage.from(BUCKET_FOTOS).getPublicUrl(ruta).data.publicUrl;
    }),
  );
}

export async function guardarPublicacion(p: Publicacion) {
  if (!supabaseConfigurado) throw new Error("Supabase no está configurado");
  const fotos = await subirFotos(p.fotos);
  const { error } = await supabaseNavegador()
    .from("publicaciones")
    .upsert(aFila({ ...p, fotos, actualizadaEn: new Date().toISOString() }));
  if (error) throw error;
  avisar();
}

/* Borra la publicación y sus fotos de Storage (las de /public, como las de ejemplo, no se tocan) */
export async function eliminarDefinitivo(id: string) {
  if (!supabaseConfigurado) throw new Error("Supabase no está configurado");
  const supabase = supabaseNavegador();
  const { data } = await supabase.from("publicaciones").select("fotos").eq("id", id).maybeSingle();
  const { error } = await supabase.from("publicaciones").delete().eq("id", id);
  if (error) throw error;
  const marcador = `/object/public/${BUCKET_FOTOS}/`;
  const rutas = ((data?.fotos as string[] | undefined) ?? []).filter((f) => f.includes(marcador)).map((f) => f.split(marcador)[1]!);
  if (rutas.length) await supabase.storage.from(BUCKET_FOTOS).remove(rutas);
  avisar();
}

/* Publicaciones visibles para el público; se actualiza si el panel guarda cambios en otra pestaña */
export function usePublicacionesPublicas() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    // Si se llegó con «Regresar», al terminar de cargar se vuelve a la altura donde estabas
    let volver = esRegreso();
    const cargar = () =>
      listarPublicaciones()
        .then((todas) => activo && setPublicaciones(todas.filter((p) => p.publicada && !p.eliminadaEn)))
        .catch(() => activo && setPublicaciones(publicacionesIniciales))
        .finally(() => {
          if (!activo) return;
          setCargando(false);
          if (volver) restaurarPosicion();
          volver = false;
        });
    cargar();
    canal?.addEventListener("message", cargar);
    return () => {
      activo = false;
      canal?.removeEventListener("message", cargar);
    };
  }, []);

  return { publicaciones, cargando };
}
