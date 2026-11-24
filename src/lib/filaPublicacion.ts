import type { Operacion, Publicacion, Seccion } from "@/lib/publicaciones";

/* Conversión entre la fila de Supabase (snake_case) y el tipo Publicacion que usa el sitio.
   Lo usan el almacén del navegador y las páginas de servidor. */
export type FilaPublicacion = {
  id: string;
  clave: string;
  seccion: Seccion;
  operacion: Operacion;
  categoria: string;
  titulo: string;
  descripcion: string;
  precio: number | null;
  precio_desde: boolean;
  forma_pago: string;
  colonia: string;
  municipio: string;
  estado: string;
  terreno_m2: number | null;
  construccion_m2: number | null;
  recamaras: number | null;
  banos: number | null;
  estacionamientos: number | null;
  huespedes: number | null;
  extras: string[];
  fotos: string[];
  video: string;
  mapa: string;
  publicada: boolean;
  destacada: boolean;
  creada_en: string;
  actualizada_en: string;
  eliminada_en: string | null;
};

const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));

export const deFila = (f: FilaPublicacion): Publicacion => ({
  id: f.id,
  clave: f.clave,
  seccion: f.seccion,
  operacion: f.operacion,
  categoria: f.categoria,
  titulo: f.titulo,
  descripcion: f.descripcion,
  precio: num(f.precio),
  precioDesde: f.precio_desde,
  formaPago: f.forma_pago,
  colonia: f.colonia,
  municipio: f.municipio,
  estado: f.estado,
  terrenoM2: num(f.terreno_m2),
  construccionM2: num(f.construccion_m2),
  recamaras: num(f.recamaras),
  banos: num(f.banos),
  estacionamientos: num(f.estacionamientos),
  huespedes: num(f.huespedes),
  extras: f.extras ?? [],
  fotos: f.fotos ?? [],
  video: f.video,
  mapa: f.mapa,
  publicada: f.publicada,
  destacada: f.destacada,
  creadaEn: f.creada_en,
  actualizadaEn: f.actualizada_en,
  eliminadaEn: f.eliminada_en,
});

export const aFila = (p: Publicacion): FilaPublicacion => ({
  id: p.id,
  clave: p.clave,
  seccion: p.seccion,
  operacion: p.operacion,
  categoria: p.categoria,
  titulo: p.titulo,
  descripcion: p.descripcion,
  precio: p.precio,
  precio_desde: p.precioDesde,
  forma_pago: p.formaPago,
  colonia: p.colonia,
  municipio: p.municipio,
  estado: p.estado,
  terreno_m2: p.terrenoM2,
  construccion_m2: p.construccionM2,
  recamaras: p.recamaras,
  banos: p.banos,
  estacionamientos: p.estacionamientos,
  huespedes: p.huespedes,
  extras: p.extras,
  fotos: p.fotos,
  video: p.video,
  mapa: p.mapa,
  publicada: p.publicada,
  destacada: p.destacada,
  creada_en: p.creadaEn,
  actualizada_en: p.actualizadaEn,
  eliminada_en: p.eliminadaEn,
});
