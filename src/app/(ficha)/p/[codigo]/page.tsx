import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import { FichaSinDatos } from "@/components/ficha/FichaSinDatos";
import { fichaDesdeCompartida, type DatosFicha, type FichaCompartida } from "@/lib/ficha";
import { supabasePublico } from "@/lib/supabase/servidor";
import { supabaseConfigurado } from "@/lib/supabase/config";

/* =========================================================
   ENLACE SIN DATOS: /p/[codigo]
   La consulta pasa por la función ficha_compartida de Supabase,
   que solo devuelve campos comerciales autorizados (sin clave,
   sección, mapa ni datos internos; sin precio si está oculto).
   Siempre se consulta al momento: desactivar o vencer un enlace
   lo apaga de inmediato. Diseño: idea_vista/vista2.jpeg
   (sin formularios ni datos de contacto).
   ========================================================= */

export const dynamic = "force-dynamic";

const CODIGO_VALIDO = /^[a-zA-Z0-9]{6,32}$/;

const cargar = cache(async (codigo: string): Promise<DatosFicha | null> => {
  if (!supabaseConfigurado || !CODIGO_VALIDO.test(codigo)) return null;
  const { data, error } = await supabasePublico().rpc("ficha_compartida", { p_codigo: codigo });
  if (error || !data) return null;
  return fichaDesdeCompartida(data as FichaCompartida);
});

/* Base para volver absolutas las fotos locales (/images/...) en la vista previa de WhatsApp */
async function origen() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return new URL(`${protocolo}://${host}`);
}

export async function generateMetadata({ params }: { params: Promise<{ codigo: string }> }): Promise<Metadata> {
  const ficha = await cargar((await params).codigo);
  if (!ficha) return { title: "Propiedad no disponible" };
  const descripcion = [ficha.etiqueta, ficha.datos.slice(0, 3).join(" · ")].filter(Boolean).join(" · ");
  return {
    metadataBase: await origen(),
    title: ficha.titulo,
    description: descripcion,
    openGraph: {
      type: "website",
      title: ficha.titulo,
      description: descripcion,
      images: ficha.fotos[0] ? [{ url: ficha.fotos[0] }] : undefined,
    },
    twitter: { card: "summary_large_image", title: ficha.titulo, description: descripcion },
  };
}

export default async function FichaCompartidaPage({ params }: { params: Promise<{ codigo: string }> }) {
  const ficha = await cargar((await params).codigo);

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-4 text-neutral-900 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
      {ficha ? <FichaSinDatos ficha={ficha} /> : <NoDisponible />}
    </main>
  );
}

function NoDisponible() {
  return (
    <div className="grid min-h-[80vh] place-items-center text-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-neutral-950">Esta propiedad ya no está disponible</h1>
        <p className="mt-3 text-[0.9375rem] leading-7 text-neutral-600">Es posible que el enlace haya vencido o que la propiedad ya no esté en oferta.</p>
      </div>
    </div>
  );
}
