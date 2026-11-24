import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FichaPropiedad, fondoPagina } from "@/components/ficha/FichaPropiedad";
import { BotonesCompartir } from "@/components/ficha/BotonesCompartir";
import { BotonRegresar } from "@/components/ficha/BotonRegresar";
import { SolicitarVisita } from "@/components/ficha/SolicitarVisita";
import { fichaDesdePublicacion } from "@/lib/ficha";
import { deFila, type FilaPublicacion } from "@/lib/filaPublicacion";
import { publicacionesIniciales, type Publicacion, type Seccion } from "@/lib/publicaciones";
import { divisiones, whatsappUrl } from "@/lib/site";
import { supabasePublico } from "@/lib/supabase/servidor";
import { supabaseConfigurado } from "@/lib/supabase/config";

/* =========================================================
   DETALLE DE PROPIEDAD (sitio con marca)
   Se abre desde cualquier tarjeta del catálogo. Lleva los dos
   botones de compartir y el formulario de visita por WhatsApp.
   ========================================================= */

export const dynamic = "force-dynamic";

/* Si abrieron la propiedad directo (sin página anterior en el sitio), «Regresar» lleva aquí */
const CATALOGO: Record<Seccion, string> = {
  albavera: "/albavera#resultados",
  "civ-rentas": "/civ-rentas#catalogo",
  aqmen: "/aqmen#proyectos",
};

/* cache: la metadata y la página comparten la misma consulta */
const cargar = cache(async (id: string): Promise<{ publicacion: Publicacion; codigoSinDatos: string | null } | null> => {
  if (!supabaseConfigurado) {
    const publicacion = publicacionesIniciales.find((p) => p.id === id);
    return publicacion ? { publicacion, codigoSinDatos: null } : null;
  }
  const supabase = supabasePublico();
  const [{ data }, { data: codigo }] = await Promise.all([
    supabase.from("publicaciones").select("*").eq("id", id).maybeSingle(),
    supabase.rpc("enlace_para_aliadas", { p_publicacion: id }),
  ]);
  if (!data) return null;
  const publicacion = deFila(data as FilaPublicacion);
  if (!publicacion.publicada || publicacion.eliminadaEn) return null;
  return { publicacion, codigoSinDatos: (codigo as string | null) ?? null };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const datos = await cargar((await params).id);
  if (!datos) return { title: "Propiedad no disponible | Grupo Comalba" };
  const { publicacion: p } = datos;
  return {
    title: `${p.titulo} | Grupo Comalba`,
    description: p.descripcion.slice(0, 160) || undefined,
    openGraph: { title: p.titulo, images: p.fotos[0] ? [p.fotos[0]] : undefined },
  };
}

export default async function PropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const datos = await cargar((await params).id);
  if (!datos) notFound();
  const { publicacion: p, codigoSinDatos } = datos;
  const ficha = fichaDesdePublicacion(p);
  const telefono = divisiones.find((d) => d.slug === p.seccion)?.telefono;

  return (
    <>
      <Navbar />
      <main className={`${fondoPagina} min-h-screen px-2 pb-16 pt-24 sm:px-6 sm:pt-32 lg:px-10`}>
        <FichaPropiedad
          ficha={ficha}
          izquierda={<BotonRegresar alternativa={CATALOGO[p.seccion]} />}
          acciones={<BotonesCompartir titulo={p.titulo} codigoSinDatos={codigoSinDatos} />}
          lateral={
            <SolicitarVisita
              publicacionId={p.id}
              whatsapp={whatsappUrl(`Hola, me interesa la propiedad ${p.clave} "${p.titulo}". ¿Me dan más información?`, telefono)}
            />
          }
        />
      </main>
      <Footer />
    </>
  );
}
