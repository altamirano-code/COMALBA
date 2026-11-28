import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "@/lib/supabase/config";

/* Protege el panel: sin sesión de Supabase o con una cuenta que no es del equipo,
   /admin manda a /admin/entrar. También renueva las cookies de la sesión en cada visita al panel.
   La protección real de los datos la ponen las políticas RLS (supabase/05_equipo.sql). */
export async function middleware(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const esEntrar = request.nextUrl.pathname.startsWith("/admin/entrar");

  if (!supabaseConfigurado) {
    if (esEntrar) return respuesta;
    return NextResponse.redirect(new URL("/admin/entrar", request.url));
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Tener sesión no basta: la cuenta debe estar en la tabla "equipo" (supabase/05_equipo.sql).
  // Si la consulta falla, se niega el acceso.
  let esEquipo = false;
  if (user) {
    const { data, error } = await supabase.rpc("es_equipo");
    esEquipo = !error && data === true;
  }

  if (esEntrar) {
    if (esEquipo) return NextResponse.redirect(new URL("/admin", request.url));
    return respuesta; // Sin sesión, o con una cuenta que no es del equipo: se queda en Entrar
  }
  if (!esEquipo) {
    const destino = new URL("/admin/entrar", request.url);
    if (user) destino.searchParams.set("sinAcceso", "1");
    return NextResponse.redirect(destino);
  }
  return respuesta;
}

export const config = { matcher: ["/admin/:path*"] };
