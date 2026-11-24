/* Tipografías compartidas por los layouts del sitio y de la ficha compartida */
import localFont from "next/font/local";

// Tipografías alojadas en el proyecto (archivos latinos de Fontsource; no dependen de Google Fonts).
// next/font las precarga y crea un respaldo con sus mismas medidas, así el texto no salta al cargarlas.
// Títulos: Poppins (estilo geométrico de la referencia letras_idea.jpeg)
export const poppins = localFont({
  src: [
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-300-normal.woff2", weight: "300" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2", weight: "600" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--fuente-poppins",
  // "block": los títulos esperan a Poppins (precargada, llega bajo la intro) en vez de dibujarse con un
  // respaldo; en mayúsculas el respaldo es más ancho, partía el título del inicio y lo hacía saltar.
  display: "block",
});
// Texto e interfaz
export const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--fuente-manrope",
  display: "swap",
});
// Solo para el logotipo "COMALBA" del menú
export const cormorant = localFont({
  src: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2",
  weight: "600",
  variable: "--fuente-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
