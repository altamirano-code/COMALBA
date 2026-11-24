import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "@/lib/supabase/config";

/* Protege el panel: sin sesión de Supabase, /admin manda a /admin/entrar.
   También renueva las cookies de la sesión en cada visita al panel. */
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

  if (!user && !esEntrar) return NextResponse.redirect(new URL("/admin/entrar", request.url));
  if (user && esEntrar) return NextResponse.redirect(new URL("/admin", request.url));
  return respuesta;
}

export const config = { matcher: ["/admin/:path*"] };
