import type { Metadata, Viewport } from "next";

// Tipografías alojadas en el proyecto (no dependen de Google Fonts al compilar)
// Títulos: Source Serif 4 con eje óptico (sin cursiva: no se usa en el sitio)
import "@fontsource-variable/source-serif-4/opsz.css";
// Texto e interfaz
import "@fontsource-variable/manrope";
// Solo para el logotipo "COMALBA" del menú
import "@fontsource/cormorant-garamond/600.css";
import "./globals.css";

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
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
