/* =========================================================
   PUBLICACIONES (modelo de datos)
   Una publicación es todo lo que se muestra en el catálogo:
   propiedades de ALBAVERA (venta), CIV Rentas (anual y
   vacacional) y proyectos de AQMEN. Las destacadas también
   aparecen en el inicio.
   Dónde se guardan: ver src/lib/almacenPublicaciones.ts
   ========================================================= */

export type Seccion = "albavera" | "civ-rentas" | "aqmen";
export type Operacion = "Venta" | "Renta anual" | "Renta vacacional" | "Proyecto";

export const SECCIONES: { id: Seccion; nombre: string; detalle: string; prefijoClave: string }[] = [
  { id: "albavera", nombre: "ALBAVERA", detalle: "Venta", prefijoClave: "ALB" },
  { id: "civ-rentas", nombre: "CIV Rentas", detalle: "Renta anual y vacacional", prefijoClave: "CIV" },
  { id: "aqmen", nombre: "AQMEN", detalle: "Proyectos de cocinas y clósets", prefijoClave: "AQM" },
];

export const OPERACIONES: Record<Seccion, Operacion[]> = {
  albavera: ["Venta"],
  "civ-rentas": ["Renta anual", "Renta vacacional"],
  aqmen: ["Proyecto"],
};

/* Categorías del catálogo inmobiliario (cuestionario 3.2) */
export const CATEGORIAS = ["Casa", "Departamento", "Terreno", "Comercial", "Industrial"];
export const CATEGORIAS_AQMEN = ["Cocina integral", "Clóset", "Cocina y clóset"];
export const categoriasDe = (s: Seccion) => (s === "aqmen" ? CATEGORIAS_AQMEN : CATEGORIAS);

export const MAX_FOTOS = 20; // cuestionario 3.4
export const MAX_DESTACADAS = 4; // cuestionario 3.7

export type Publicacion = {
  id: string;
  clave: string; // Código visible de la propiedad, p. ej. ALB-004
  seccion: Seccion;
  operacion: Operacion;
  categoria: string;
  titulo: string;
  descripcion: string;
  precio: number | null; // null = "Consultar precio"
  precioDesde: boolean; // Muestra "Desde $..."
  formaPago: string;
  colonia: string;
  municipio: string;
  estado: string;
  terrenoM2: number | null;
  construccionM2: number | null;
  recamaras: number | null;
  banos: number | null;
  estacionamientos: number | null;
  huespedes: number | null; // Solo renta vacacional
  extras: string[]; // Características adicionales: alberca, jardín, seguridad…
  fotos: string[]; // La primera es la portada
  video: string;
  mapa: string; // Enlace de Google Maps
  publicada: boolean;
  destacada: boolean; // Aparece en el inicio
  creadaEn: string;
  actualizadaEn: string;
  eliminadaEn: string | null; // Con fecha = está en la papelera
};

export function nuevaPublicacion(seccion: Seccion): Publicacion {
  const ahora = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    clave: "",
    seccion,
    operacion: OPERACIONES[seccion][0],
    categoria: categoriasDe(seccion)[0],
    titulo: "",
    descripcion: "",
    precio: null,
    precioDesde: false,
    formaPago: "",
    colonia: "",
    municipio: "",
    estado: "Morelos",
    terrenoM2: null,
    construccionM2: null,
    recamaras: null,
    banos: null,
    estacionamientos: null,
    huespedes: null,
    extras: [],
    fotos: [],
    video: "",
    mapa: "",
    publicada: true,
    destacada: false,
    creadaEn: ahora,
    actualizadaEn: ahora,
    eliminadaEn: null,
  };
}

/* Siguiente clave libre de la sección: ALB-001, ALB-002… */
export function siguienteClave(seccion: Seccion, existentes: Publicacion[]) {
  const prefijo = SECCIONES.find((s) => s.id === seccion)!.prefijoClave;
  const mayor = existentes
    .filter((p) => p.clave.startsWith(`${prefijo}-`))
    .reduce((max, p) => Math.max(max, Number(p.clave.slice(prefijo.length + 1)) || 0), 0);
  return `${prefijo}-${String(mayor + 1).padStart(3, "0")}`;
}

/* ---------- Formatos para mostrar ---------- */
const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const PERIODO: Record<Operacion, string> = { Venta: "", "Renta anual": " /mes", "Renta vacacional": " /noche", Proyecto: "" };

export function precioTexto(p: Publicacion) {
  if (p.precio === null) return "Consultar precio";
  return `${p.precioDesde ? "Desde " : ""}${pesos.format(p.precio)}${PERIODO[p.operacion]}`;
}

export const ubicacionTexto = (p: Publicacion) => [p.colonia, p.municipio, p.estado].filter(Boolean).join(", ") || "Ubicación a consultar";

export type Caracteristica = { icono: "area" | "recamaras" | "banos" | "autos" | "huespedes" | "extra"; texto: string };

/* Datos clave para las tarjetas (máximo 4) */
export function caracteristicasDe(p: Publicacion): Caracteristica[] {
  const lista: Caracteristica[] = [];
  if (p.recamaras) lista.push({ icono: "recamaras", texto: `${p.recamaras} rec.` });
  if (p.banos) lista.push({ icono: "banos", texto: `${p.banos} baños` });
  if (p.estacionamientos) lista.push({ icono: "autos", texto: `${p.estacionamientos} ${p.estacionamientos === 1 ? "auto" : "autos"}` });
  if (p.huespedes) lista.push({ icono: "huespedes", texto: `${p.huespedes} huéspedes` });
  if (p.construccionM2) lista.push({ icono: "area", texto: `${p.construccionM2} m² const.` });
  else if (p.terrenoM2) lista.push({ icono: "area", texto: `${p.terrenoM2} m² terreno` });
  if (lista.length < 2 && p.extras[0]) lista.push({ icono: "extra", texto: p.extras[0] });
  return lista.slice(0, 4);
}

/* ---------- Publicaciones de ejemplo ----------
   Se cargan solo la primera vez que se abre el sitio en un navegador.
   Datos tomados de las publicaciones de ALBAVERA. */
const ejemplo = (datos: Partial<Publicacion> & Pick<Publicacion, "id" | "clave" | "seccion" | "titulo">): Publicacion => ({
  ...nuevaPublicacion(datos.seccion),
  ...datos,
  creadaEn: "2026-10-01T00:00:00.000Z",
  actualizadaEn: "2026-10-01T00:00:00.000Z",
});

export const publicacionesIniciales: Publicacion[] = [
  ejemplo({
    id: "los-volcanes",
    clave: "ALB-001",
    seccion: "albavera",
    categoria: "Departamento",
    titulo: "Departamentos modernos con alberca",
    municipio: "Los Volcanes",
    precio: 3_050_000,
    precioDesde: true,
    recamaras: 3,
    estacionamientos: 2,
    construccionM2: 110,
    extras: ["Alberca"],
    fotos: ["/images/departamentos.jpg"],
    destacada: true,
  }),
  ejemplo({
    id: "casa-residencial",
    clave: "ALB-002",
    seccion: "albavera",
    categoria: "Casa",
    titulo: "Casa residencial de diseño moderno",
    recamaras: 4,
    banos: 3.5,
    estacionamientos: 2,
    fotos: ["/images/residencia.jpg"],
    destacada: true,
  }),
  ejemplo({
    id: "huitzilac",
    clave: "ALB-003",
    seccion: "albavera",
    categoria: "Terreno",
    titulo: "Terreno rodeado de naturaleza",
    municipio: "Huitzilac",
    precio: 550_000,
    terrenoM2: 402,
    extras: ["Entorno natural"],
    fotos: ["/images/huitzilac.jpg"],
    destacada: true,
  }),
];
