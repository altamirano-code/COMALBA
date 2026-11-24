"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { alCambiarSesion, cerrarSesion, leerSesion, type UsuarioEquipo } from "@/lib/sesion";

/* Botón flotante para el equipo: solo aparece si hay sesión iniciada.
   El público nunca lo ve. Abajo a la izquierda para no chocar con WhatsApp. */
export function AccesoPanel() {
  const ruta = usePathname();
  const [usuario, setUsuario] = useState<UsuarioEquipo | null>(null);

  useEffect(() => {
    let activo = true;
    leerSesion().then((u) => activo && setUsuario(u));
    const quitar = alCambiarSesion(setUsuario);
    return () => {
      activo = false;
      quitar();
    };
  }, []);

  if (!usuario || ruta?.startsWith("/admin")) return null;

  async function salir() {
    await cerrarSesion();
    setUsuario(null);
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-1 rounded-full bg-marino-950 p-1.5 text-white shadow-xl shadow-black/25 ring-1 ring-white/15">
      <span
        title={`${usuario.nombre} · ${usuario.rol}`}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-dorado-500 text-sm font-bold text-marino-950"
      >
        {usuario.iniciales}
      </span>
      <Link
        href="/admin"
        className="flex items-center gap-2 rounded-full py-2 pl-2 pr-3 text-sm font-semibold transition hover:bg-white/10"
      >
        <LayoutDashboard size={17} strokeWidth={1.8} />
        <span>Panel</span>
      </Link>
      <button
        type="button"
        onClick={salir}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="grid size-10 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
