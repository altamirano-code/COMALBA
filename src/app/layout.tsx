import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

// Tipografías alojadas en el proyecto (archivos latinos de Fontsource; no dependen de Google Fonts).
// next/font las precarga y crea un respaldo con sus mismas medidas, así el texto no salta al cargarlas.
// Títulos: Poppins (estilo geométrico de la referencia letras_idea.jpeg)
const poppins = localFont({
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
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--fuente-manrope",
  display: "swap",
});
// Solo para el logotipo "COMALBA" del menú
const cormorant = localFont({
  src: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2",
  weight: "600",
  variable: "--fuente-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
import "./globals.css";
import { IntroComalba, scriptIntro } from "@/components/IntroComalba";

export const metadata: Metadata = {
  title: "Grupo Comalba | Espacios para nuevas posibilidades",
  description:
    "Un ecosistema inmobiliario que integra bienes raíces, rentas, proyectos, diseño y soluciones para tu espacio.",
};

export const viewport: Viewport = {
  themeColor: "#101b2d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script de la intro agrega una clase a <html> antes de hidratar
    <html lang="es-MX" suppressHydrationWarning className={`${poppins.variable} ${manrope.variable} ${cormorant.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptIntro }} />
      </head>
      <body>
        <IntroComalba />
        {children}
      </body>
    </html>
  );
}
