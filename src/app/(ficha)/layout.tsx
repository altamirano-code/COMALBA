import type { Metadata, Viewport } from "next";
import { manrope, poppins } from "../fuentes";
import "../globals.css";

/* =========================================================
   LAYOUT DE LA FICHA COMPARTIDA (enlaces sin datos)
   Layout raíz independiente del sitio: sin intro, menú, pie,
   WhatsApp, acceso al panel, favicon ni nombre de la empresa.
   ========================================================= */

export const metadata: Metadata = {
  title: "Propiedad",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function FichaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={`${poppins.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
