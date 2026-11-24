import type { Metadata, Viewport } from "next";
import { cormorant, manrope, poppins } from "../fuentes";
import "../globals.css";
import { IntroComalba, scriptIntro } from "@/components/IntroComalba";
import { AccesoPanel } from "@/components/AccesoPanel";
import { RastreadorNavegacion } from "@/components/RastreadorNavegacion";

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
        <AccesoPanel />
        <RastreadorNavegacion />
      </body>
    </html>
  );
}
