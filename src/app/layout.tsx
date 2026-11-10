import type { Metadata, Viewport } from "next";

// Tipografías alojadas en el proyecto (no dependen de Google Fonts al compilar)
// Títulos: Poppins (estilo geométrico de la referencia letras_idea.jpeg)
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
// Texto e interfaz
import "@fontsource-variable/manrope";
// Solo para el logotipo "COMALBA" del menú
import "@fontsource/cormorant-garamond/600.css";
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
    <html lang="es-MX" suppressHydrationWarning>
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
