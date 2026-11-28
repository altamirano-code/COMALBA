"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { cerrarSesion, iniciarSesion, MENSAJE_SIN_ACCESO } from "@/lib/sesion";
import { supabaseConfigurado } from "@/lib/supabase/config";

/* Acceso al panel. Los usuarios se crean en Supabase → Authentication → Users
   y se agregan a la tabla "equipo" (supabase/05_equipo.sql). */
export default function EntrarPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  /* El middleware manda aquí con ?sinAcceso=1 a una cuenta con sesión que no es del equipo:
     se avisa y se cierra esa sesión para poder entrar con otra */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("sinAcceso") !== "1") return;
    setError(MENSAJE_SIN_ACCESO);
    cerrarSesion();
  }, []);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    const fallo = await iniciarSesion(correo, contrasena);
    if (fallo) {
      setError(fallo);
      setEnviando(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#e9ecf1] px-4 py-10 text-tinta">
      <div className="w-full max-w-sm">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-white p-1.5 shadow-sm">
            <Image src="/logos/Comalba_Grupo_sf.png" alt="" width={60} height={40} className="h-auto w-full object-contain" />
          </span>
          <span className="font-semibold text-marino-900">Grupo Comalba</span>
        </Link>

        <form onSubmit={entrar} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-marino-950/8 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-marino-900 text-white">
              <LockKeyhole size={18} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-marino-900">Panel del equipo</h1>
              <p className="text-sm text-piedra">Inicia sesión para continuar</p>
            </div>
          </div>

          {!supabaseConfigurado && (
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
              Falta conectar Supabase: agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.
            </p>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-marino-900">Correo</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="h-12 w-full rounded-xl border border-marino-950/15 px-4 text-base outline-none transition focus:border-marino-700 focus:ring-2 focus:ring-marino-700/15"
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-sm font-semibold text-marino-900">Contraseña</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="h-12 w-full rounded-xl border border-marino-950/15 px-4 text-base outline-none transition focus:border-marino-700 focus:ring-2 focus:ring-marino-700/15"
            />
          </label>

          {error && (
            <p role="alert" className="mb-4 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || !supabaseConfigurado}
            className="h-12 w-full rounded-xl bg-marino-900 text-sm font-bold text-white transition hover:bg-marino-700 disabled:opacity-50"
          >
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
