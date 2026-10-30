import type { Metadata, Viewport } from "next";

// Tipografías alojadas en el proyecto (no dependen de Google Fonts al compilar)
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource-variable/manrope";
// Solo para el titular principal del inicio
import "@fontsource-variable/brygada-1918/wght.css";
import "@fontsource-variable/brygada-1918/wght-italic.css";
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
