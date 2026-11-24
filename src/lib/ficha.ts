import { formatoPrecio, ubicacionTexto, type Operacion, type Publicacion } from "@/lib/publicaciones";

/* =========================================================
   FICHA DE PROPIEDAD
   Lo que muestra la página de detalle, ya listo para pintar.
   Se arma desde una Publicacion (sitio con marca) o desde la
   respuesta de ficha_compartida (enlace sin datos), que nunca
   trae clave, sección, mapa ni datos internos.
   ========================================================= */

export type DatosFicha = {
  titulo: string;
  etiqueta: string; // Píldora: "Venta", "Renta anual"… o el tipo de proyecto
  categoria: string;
  precio: string; // Texto listo: "$2,450,000", "Consultar precio" o "$$$"
  formaPago: string;
  ubicacion: string | null;
  datos: string[]; // "3 Recámaras", "2 Baños", "180 m² construcción"…
  cifras: Cifra[]; // Cifras grandes del enlace sin datos: 233 m² · 4 recámaras · 5 baños
  especificaciones: Especificacion[]; // Ficha técnica completa
  descripcion: string;
  extras: string[];
  fotos: string[];
  video: string;
  nota: string;
};

export type Cifra = { valor: string; unidad: string };
export type Especificacion = { etiqueta: string; valor: string };

/* Respuesta de la función ficha_compartida (supabase/esquema.sql) */
export type FichaCompartida = {
  titulo: string;
  operacion: Operacion;
  categoria: string;
  descripcion: string;
  precio_visible: boolean;
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
  extras: string[] | null;
  fotos: string[] | null;
  video: string;
  nota: string;
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
const n = (v: number | string | null) => (v === null || v === "" ? null : Number(v));

function lineaDatos(d: {
  recamaras: number | null;
  banos: number | null;
  estacionamientos: number | null;
  construccionM2: number | null;
  terrenoM2: number | null;
  huespedes: number | null;
}) {
  const lista: string[] = [];
  if (d.recamaras) lista.push(plural(d.recamaras, "Recámara", "Recámaras"));
  if (d.banos) lista.push(plural(d.banos, "Baño", "Baños"));
  if (d.estacionamientos) lista.push(plural(d.estacionamientos, "Estacionamiento", "Estacionamientos"));
  if (d.construccionM2) lista.push(`${d.construccionM2.toLocaleString("es-MX")} m² construcción`);
  if (d.terrenoM2) lista.push(`${d.terrenoM2.toLocaleString("es-MX")} m² terreno`);
  if (d.huespedes) lista.push(plural(d.huespedes, "Huésped", "Huéspedes"));
  return lista;
}

type Medidas = Parameters<typeof lineaDatos>[0];

const decimal = (v: number) => v.toLocaleString("es-MX");

function cifrasDe(d: Medidas): Cifra[] {
  const lista: Cifra[] = [];
  const m2 = d.construccionM2 ?? d.terrenoM2;
  if (m2) lista.push({ valor: decimal(m2), unidad: "m²" });
  if (d.recamaras) lista.push({ valor: decimal(d.recamaras), unidad: d.recamaras === 1 ? "recámara" : "recámaras" });
  if (d.banos) lista.push({ valor: decimal(d.banos), unidad: d.banos === 1 ? "baño" : "baños" });
  if (d.estacionamientos) lista.push({ valor: decimal(d.estacionamientos), unidad: d.estacionamientos === 1 ? "auto" : "autos" });
  if (d.huespedes) lista.push({ valor: decimal(d.huespedes), unidad: d.huespedes === 1 ? "huésped" : "huéspedes" });
  return lista.slice(0, 4);
}

function especificacionesDe(d: Medidas & { categoria: string; operacion: Operacion; ubicacion: string | null; formaPago: string }): Especificacion[] {
  const filas: [string, string | number | null][] = [
    ["Tipo", d.categoria],
    ["Operación", d.operacion === "Proyecto" ? "Proyecto a la medida" : d.operacion],
    ["Construcción", d.construccionM2 ? `${decimal(d.construccionM2)} m²` : null],
    ["Terreno", d.terrenoM2 ? `${decimal(d.terrenoM2)} m²` : null],
    ["Recámaras", d.recamaras],
    ["Baños", d.banos],
    ["Estacionamientos", d.estacionamientos],
    ["Huéspedes", d.huespedes],
    ["Ubicación", d.ubicacion],
    ["Forma de pago", d.formaPago || null],
  ];
  return filas.filter(([, v]) => v !== null && v !== "" && v !== 0).map(([etiqueta, v]) => ({ etiqueta, valor: typeof v === "number" ? decimal(v) : v! }));
}

const etiquetaDe = (operacion: Operacion, categoria: string) => (operacion === "Proyecto" ? categoria : operacion);

export function fichaDesdePublicacion(p: Publicacion): DatosFicha {
  return {
    titulo: p.titulo,
    etiqueta: etiquetaDe(p.operacion, p.categoria),
    categoria: p.categoria,
    precio: formatoPrecio(p.precio, p.precioDesde, p.operacion),
    formaPago: p.formaPago,
    ubicacion: ubicacionTexto(p),
    datos: lineaDatos(p),
    cifras: cifrasDe(p),
    especificaciones: especificacionesDe({ ...p, ubicacion: ubicacionTexto(p) }),
    descripcion: p.descripcion,
    extras: p.extras,
    fotos: p.fotos,
    video: p.video,
    nota: "",
  };
}

export function fichaDesdeCompartida(f: FichaCompartida): DatosFicha {
  const ubicacion = [f.colonia, f.municipio, f.estado].filter(Boolean).join(", ");
  const medidas: Medidas = {
    recamaras: n(f.recamaras),
    banos: n(f.banos),
    estacionamientos: n(f.estacionamientos),
    construccionM2: n(f.construccion_m2),
    terrenoM2: n(f.terreno_m2),
    huespedes: n(f.huespedes),
  };
  return {
    titulo: f.titulo,
    etiqueta: etiquetaDe(f.operacion, f.categoria),
    categoria: f.categoria,
    precio: f.precio_visible ? formatoPrecio(n(f.precio), f.precio_desde, f.operacion) : "$$$",
    formaPago: f.forma_pago,
    ubicacion: ubicacion || null,
    datos: lineaDatos(medidas),
    cifras: cifrasDe(medidas),
    especificaciones: especificacionesDe({
      ...medidas,
      categoria: f.categoria,
      operacion: f.operacion,
      ubicacion: ubicacion || null,
      formaPago: f.forma_pago,
    }),
    descripcion: f.descripcion,
    extras: f.extras ?? [],
    fotos: f.fotos ?? [],
    video: f.video,
    nota: f.nota,
  };
}
