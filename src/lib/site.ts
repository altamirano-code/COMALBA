/* =========================================================
   DATOS DEL SITIO
   Todo lo que cambia con frecuencia vive aquí: contacto,
   menú, divisiones y propiedades destacadas.
   ========================================================= */

export const contacto = {
  // Número internacional sin "+" ni espacios. Si existe NEXT_PUBLIC_WHATSAPP_NUMBER en .env, tiene prioridad.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "527771091524",
  telefono: "7771091524",
  correo: "inmueblesycertezajuridica@gmail.com",
  facebook: "https://www.facebook.com/COMALBASADECV/",
  instagram: "", // Pega aquí el enlace del perfil oficial; si queda vacío, el ícono no se muestra
  ubicacion: "Cuernavaca, Morelos",
  // Punto del mapa del pie de página (C.P. 62374, Cuernavaca, Morelos)
  mapa: { lat: 18.89122772216797, lng: -99.22347259521484 },
};

/* Logo oficial de Comalba. Si el enlace deja de funcionar, se usa la copia local de /public/logos.
   Para no depender de internet: descarga la imagen, guárdala como public/logos/comalba.png
   y cambia "remoto" por "/logos/comalba.png". */
export const logoComalba = {
  remoto: "https://static.tokkobroker.com/tfw_images/3052_COMALBA%20S.A.%20de%20C.V./FEF73781-0AD0-41AD-8590-D27C90184D55.png",
  local: "/logos/grupo-comalba.png",
};

/* Íconos de redes sociales (imágenes proporcionadas). Si no cargan, se muestra un ícono dibujado. */
export const iconosRedes = {
  facebook: "https://static.tv-azteca.production.tv-azteca.brightspot.cloud/22/9f/7e52050044ce8cfa6b57c7acce75/icono-facebook.png",
  instagram: "https://static.tv-azteca.production.tv-azteca.brightspot.cloud/35/54/3e0388b1438a8be3118e56ce5845/icono-instagram.png",
};

/* Textos institucionales del pie de página */
export const textoEmpresa =
  "Somos una Empresa conformada por un Staff de Jóvenes Profesionales, quienes se capacitan permanentemente con el objetivo de estar al pie de la vanguardia, que el avance tanto social como tecnológico lo requieren en la actualidad.";

export const avisoLegal =
  "Todas las medidas enunciadas son meramente orientativas, las medidas exactas serán las que se expresen en el respectivo título de propiedad de cada inmueble. Todas las fotos, imagenes y videos son meramente ilustrativos y no contractuales. Los precios enunciados son meramente orientativos y no contractuales.";

export const formatearTelefono = (tel: string) => tel.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

/* Sin número usa el WhatsApp general; con número (10 dígitos) usa el de esa división */
export const whatsappUrl = (mensaje: string, telefono?: string) =>
  `https://wa.me/${telefono ? `52${telefono}` : contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;

/* ---------- Navegación ---------- */
export type NavItem = { label: string; href: string; id: string };

export const navegacion: NavItem[] = [
  { label: "Inicio", href: "/#inicio", id: "inicio" },
  { label: "Propiedades", href: "/#propiedades", id: "propiedades" },
  { label: "Venta", href: "/#venta", id: "venta" },
  { label: "La Empresa", href: "/#empresa", id: "empresa" },
  // "Divisiones" se inserta aquí como menú desplegable (ver Navbar)
  { label: "Valuación", href: "/#valuacion", id: "valuacion" },
  { label: "Contacto", href: "/#contacto", id: "contacto" },
];

/* ---------- Divisiones ---------- */
export type Division = {
  slug: string;
  nombre: string;
  etiqueta: string;
  resumen: string;
  logo?: string; // Sin logo se muestra el ícono de la división (Financiamiento)
  telefono?: string; // 10 dígitos. Si no tiene, se usa el contacto general
};

export const divisiones: Division[] = [
  {
    slug: "albavera",
    nombre: "ALBAVERA Bienes Raíces",
    etiqueta: "Compra y venta",
    resumen: "Te acompañamos a encontrar y adquirir la propiedad ideal para tu siguiente etapa.",
    logo: "/logos/Albavera_sf.png",
    telefono: "7771310715",
  },
  {
    slug: "civ-rentas",
    nombre: "CIV Rentas",
    etiqueta: "Rentas anuales y vacacionales",
    resumen: "Rentas por año para comercio, industria y vivienda, y casas o departamentos para vacacionar.",
    logo: "/logos/civ-rentas__sf.png",
    telefono: "7771310715",
  },
  {
    slug: "asesoria-proyectos",
    nombre: "Asesoría y Proyectos",
    etiqueta: "Gestión y desarrollo",
    resumen: "Asesoría jurídica, gestoría inmobiliaria, mantenimiento y desarrollo de proyectos.",
    logo: "/logos/grupo-comalba.png",
  },
  {
    slug: "aqmen",
    nombre: "AQMEN Modern Furniture",
    etiqueta: "Cocinas y clósets",
    resumen: "Cocinas integrales y clósets modernos, funcionales y hechos a la medida.",
    logo: "/logos/aqmen.png",
    telefono: "7779316342",
  },
  {
    slug: "immor",
    nombre: "Transportes IMMOR",
    etiqueta: "Fletes y mudanzas",
    resumen: "Traslado seguro de muebles y pertenencias hasta tu nuevo destino.",
    logo: "/logos/transportes-immor.png",
    telefono: "7774523252",
  },
  {
    slug: "financiamiento",
    nombre: "Financiamiento Inmobiliario",
    etiqueta: "Compra, construye y remodela",
    resumen: "Financia tu inmueble a 10 años con tasa preferencial de 4% anual y comprobación de ingresos flexible.",
    telefono: "7774497048",
  },
];

/* ---------- Imágenes del inicio (carrusel de fondo) ---------- */
export const slidesInicio = [
  { src: "/images/hero-departamentos.jpg", titulo: "Departamentos modernos", lugar: "Los Volcanes", posicion: "50% 50%" },
  { src: "/images/hero-residencia.jpg", titulo: "Tu nuevo hogar", lugar: "Residencial", posicion: "50% 50%" },
  { src: "/images/hero-cuernavaca.jpg", titulo: "Casa con alberca", lugar: "Cuernavaca, Morelos", posicion: "50% 55%" },
];

/* ---------- Propiedades destacadas ----------
   Datos tomados de las publicaciones de ALBAVERA.
   Las propiedades que se publiquen desde /admin se agregan después de estas. */
export type Caracteristica = { icono: "area" | "recamaras" | "banos" | "autos" | "naturaleza"; texto: string };

export type Propiedad = {
  id: string;
  titulo: string;
  ubicacion: string;
  precio: string;
  operacion: string;
  tipo: string;
  imagen: string;
  caracteristicas: Caracteristica[];
};

export const propiedadesDestacadas: Propiedad[] = [
  {
    id: "los-volcanes",
    titulo: "Departamentos modernos con alberca",
    ubicacion: "Los Volcanes, Morelos",
    precio: "Desde $3,050,000 MXN",
    operacion: "Venta",
    tipo: "Departamento",
    imagen: "/images/departamentos.jpg",
    caracteristicas: [
      { icono: "recamaras", texto: "3 rec." },
      { icono: "autos", texto: "2 autos" },
      { icono: "area", texto: "110 m² const." },
    ],
  },
  {
    id: "casa-residencial",
    titulo: "Casa residencial de diseño moderno",
    ubicacion: "Morelos",
    precio: "Consultar precio",
    operacion: "Venta",
    tipo: "Casa",
    imagen: "/images/residencia.jpg",
    caracteristicas: [
      { icono: "recamaras", texto: "4 hab." },
      { icono: "banos", texto: "3.5 baños" },
      { icono: "autos", texto: "2 autos" },
    ],
  },
  {
    id: "huitzilac",
    titulo: "Terreno rodeado de naturaleza",
    ubicacion: "Huitzilac, Morelos",
    precio: "$550,000 MXN",
    operacion: "Venta",
    tipo: "Terreno",
    imagen: "/images/huitzilac.jpg",
    caracteristicas: [
      { icono: "area", texto: "402 m² terreno" },
      { icono: "naturaleza", texto: "Entorno natural" },
    ],
  },
];
