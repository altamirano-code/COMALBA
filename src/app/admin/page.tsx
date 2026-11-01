"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  Building2,
  Bell,
  CalendarClock,
  Camera,
  ChevronLeft,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Inbox,
  LayoutDashboard,
  MapPin,
  Maximize2,
  Menu,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { EditorPublicacion } from "@/components/admin/EditorPublicacion";
import { eliminarDefinitivo, guardarPublicacion, listarPublicaciones } from "@/lib/almacenPublicaciones";
import {
  CATEGORIAS,
  CATEGORIAS_AQMEN,
  MAX_DESTACADAS,
  SECCIONES,
  nuevaPublicacion,
  precioTexto,
  siguienteClave,
  ubicacionTexto,
  type Publicacion,
  type Seccion,
} from "@/lib/publicaciones";

/* =========================================================
   PANEL DE ADMINISTRACIÓN
   Administra todas las publicaciones del sitio: ALBAVERA,
   CIV Rentas, AQMEN y las destacadas del inicio.
   Pendiente al definir servidor: inicio de sesión y roles
   (Marketing / Dirección General), registro de cambios por
   usuario y solicitudes de clientes.
   ========================================================= */

type Vista = "resumen" | "publicaciones" | "destacadas" | "papelera";

type Filtros = {
  seccion: "" | Seccion;
  operacion: string;
  categoria: string;
  recamaras: string;
  banos: string;
  m2: string;
  precio: string;
  huespedes: string;
  estado: string;
  desde: string;
};
const SIN_FILTROS: Filtros = { seccion: "", operacion: "", categoria: "", recamaras: "", banos: "", m2: "", precio: "", huespedes: "", estado: "", desde: "" };

type Rango = { id: string; texto: string; min: number; max: number };
const rangos = (lista: [string, string, number, number][]): Rango[] => lista.map(([id, texto, min, max]) => ({ id, texto, min, max }));

/* La escala de precios cambia con la división: venta en millones, renta anual por mes, vacacional por noche */
const PRECIOS: Record<"venta" | "mensual" | "noche", Rango[]> = {
  venta: rangos([["1", "Hasta $1 M", 0, 1e6], ["2", "$1 a $2 M", 1e6, 2e6], ["4", "$2 a $4 M", 2e6, 4e6], ["+", "Más de $4 M", 4e6, Infinity]]),
  mensual: rangos([["10", "Hasta $10 mil", 0, 1e4], ["25", "$10 a $25 mil", 1e4, 25e3], ["50", "$25 a $50 mil", 25e3, 5e4], ["+", "Más de $50 mil", 5e4, Infinity]]),
  noche: rangos([["2", "Hasta $2 mil", 0, 2e3], ["5", "$2 a $5 mil", 2e3, 5e3], ["+", "Más de $5 mil", 5e3, Infinity]]),
};
const escalaPrecio = (f: Filtros) => (f.seccion === "albavera" ? "venta" : f.operacion === "Renta vacacional" ? "noche" : "mensual");

const SUPERFICIES = rangos([["100", "Hasta 100 m²", 0, 100], ["200", "100–200 m²", 100, 200], ["400", "200–400 m²", 200, 400], ["+", "Más de 400 m²", 400, Infinity]]);

const enRango = (valor: number | null, rango?: Rango) => !rango || (valor !== null && valor >= rango.min && valor <= rango.max);

/* Qué filtros tienen sentido en cada división */
function filtrosVisibles(f: Filtros) {
  const inmueble = f.seccion === "albavera" || f.seccion === "civ-rentas";
  const vivienda = inmueble && (!f.categoria || f.categoria === "Casa" || f.categoria === "Departamento");
  return {
    operacion: f.seccion === "civ-rentas",
    recamaras: vivienda,
    banos: vivienda,
    m2: inmueble,
    precio: inmueble,
    huespedes: f.seccion === "civ-rentas" && f.operacion === "Renta vacacional",
  };
}

function cumple(p: Publicacion, f: Filtros) {
  const ver = filtrosVisibles(f);
  const precio = f.precio === "sin" ? p.precio === null : enRango(p.precio, PRECIOS[escalaPrecio(f)].find((r) => r.id === f.precio));
  return (
    (!f.seccion || p.seccion === f.seccion) &&
    (!ver.operacion || !f.operacion || p.operacion === f.operacion) &&
    (!f.categoria || p.categoria === f.categoria) &&
    (!ver.recamaras || !f.recamaras || (p.recamaras ?? 0) >= Number(f.recamaras)) &&
    (!ver.banos || !f.banos || (p.banos ?? 0) >= Number(f.banos)) &&
    (!ver.m2 || enRango(p.construccionM2 ?? p.terrenoM2, SUPERFICIES.find((r) => r.id === f.m2))) &&
    (!ver.precio || !f.precio || precio) &&
    (!ver.huespedes || !f.huespedes || (p.huespedes ?? 0) >= Number(f.huespedes)) &&
    (!f.estado || (f.estado === "publicada" ? p.publicada : f.estado === "oculta" ? !p.publicada : p.destacada)) &&
    (!f.desde || p.actualizadaEn.slice(0, 10) >= f.desde)
  );
}

/* Catálogo público de cada división (sin división: el inicio) */
const CATALOGOS: Record<"" | Seccion, { href: string; texto: string }> = {
  "": { href: "/#propiedades", texto: "Catálogo" },
  albavera: { href: "/albavera", texto: "Catálogo ALBAVERA" },
  "civ-rentas": { href: "/civ-rentas", texto: "Catálogo CIV Rentas" },
  aqmen: { href: "/aqmen", texto: "Proyectos AQMEN" },
};

const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
const nombreSeccion = (s: Seccion) => SECCIONES.find((x) => x.id === s)!.nombre;

/* Descarga un CSV que Excel abre con acentos correctos (cuestionario 4.3) */
function exportarExcel(lista: Publicacion[]) {
  const columnas: [string, (p: Publicacion) => string | number | null][] = [
    ["Clave", (p) => p.clave],
    ["Sección", (p) => nombreSeccion(p.seccion)],
    ["Operación", (p) => p.operacion],
    ["Categoría", (p) => p.categoria],
    ["Título", (p) => p.titulo],
    ["Precio", (p) => p.precio],
    ["Forma de pago", (p) => p.formaPago],
    ["Colonia", (p) => p.colonia],
    ["Municipio", (p) => p.municipio],
    ["Estado", (p) => p.estado],
    ["Terreno m²", (p) => p.terrenoM2],
    ["Construcción m²", (p) => p.construccionM2],
    ["Recámaras", (p) => p.recamaras],
    ["Baños", (p) => p.banos],
    ["Estacionamientos", (p) => p.estacionamientos],
    ["Fotos", (p) => p.fotos.length],
    ["Publicada", (p) => (p.publicada ? "Sí" : "No")],
    ["Destacada", (p) => (p.destacada ? "Sí" : "No")],
    ["Actualizada", (p) => p.actualizadaEn.slice(0, 10)],
  ];
  const celda = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const filas = [columnas.map(([t]) => celda(t)), ...lista.map((p) => columnas.map(([, f]) => celda(f(p))))].map((f) => f.join(","));
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(new Blob(["﻿" + filas.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  enlace.download = `publicaciones-comalba-${new Date().toISOString().slice(0, 10)}.csv`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

export default function AdminPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState<Vista>("publicaciones");
  const [busqueda, setBusqueda] = useState("");
  const [verFiltros, setVerFiltros] = useState(true);
  const [borrador, setBorrador] = useState<Filtros>(SIN_FILTROS);
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);
  const [editando, setEditando] = useState<{ publicacion: Publicacion; esNueva: boolean } | null>(null);
  const [aviso, setAviso] = useState("");
  const [menuMovil, setMenuMovil] = useState(false);
  const [compacto, setCompacto] = useState(false);

  const recargar = useCallback(async () => {
    try {
      setPublicaciones(await listarPublicaciones());
    } catch {
      setAviso("No se pudieron leer las publicaciones de este navegador.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const activas = publicaciones.filter((p) => !p.eliminadaEn);
  const papelera = publicaciones.filter((p) => p.eliminadaEn);
  const destacadas = activas.filter((p) => p.destacada);

  const base = vista === "papelera" ? papelera : vista === "destacadas" ? destacadas : activas;
  const q = busqueda.trim().toLowerCase();
  const lista = base.filter(
    (p) => cumple(p, filtros) && (!q || `${p.clave} ${p.titulo} ${ubicacionTexto(p)} ${p.categoria}`.toLowerCase().includes(q)),
  );
  const hayFiltros = Object.entries(filtros).some(([k, v]) => k !== "seccion" && v);
  const ver = filtrosVisibles(borrador);
  const enVista = (s: "" | Seccion) => base.filter((p) => !s || p.seccion === s).length;

  /* Cambiar de división aplica de inmediato y reinicia los filtros propios de la anterior */
  function elegirSeccion(seccion: "" | Seccion) {
    const f = { ...SIN_FILTROS, seccion };
    setBorrador(f);
    setFiltros(f);
  }

  async function guardar(p: Publicacion, mensaje: string) {
    await guardarPublicacion(p);
    await recargar();
    setAviso(mensaje);
  }

  function crear() {
    const seccion = filtros.seccion || "albavera";
    setEditando({ publicacion: { ...nuevaPublicacion(seccion), clave: siguienteClave(seccion, publicaciones) }, esNueva: true });
  }

  async function alternarDestacada(p: Publicacion) {
    if (!p.destacada && destacadas.length >= MAX_DESTACADAS) {
      setAviso(`Ya hay ${MAX_DESTACADAS} destacadas en el inicio. Quita una antes de elegir otra.`);
      return;
    }
    await guardar({ ...p, destacada: !p.destacada }, p.destacada ? `${p.clave} ya no aparece en el inicio.` : `${p.clave} ahora aparece en el inicio.`);
  }

  async function borrarDefinitivo(p: Publicacion) {
    if (!confirm(`¿Eliminar ${p.clave} "${p.titulo}" para siempre? Esta acción no se puede deshacer.`)) return;
    await eliminarDefinitivo(p.id);
    await recargar();
    setAviso(`${p.clave} se eliminó definitivamente.`);
  }

  function irA(v: Vista) {
    setVista(v);
    setMenuMovil(false);
  }

  const titulos: Record<Vista, string> = {
    resumen: "Resumen",
    publicaciones: "Publicaciones",
    destacadas: "Destacadas en el inicio",
    papelera: "Papelera",
  };

  return (
    <div className="min-h-screen bg-[#e9ecf1] p-0 text-tinta lg:p-3">
      <div className="flex min-h-screen gap-3 lg:min-h-[calc(100vh-1.5rem)]">
        {/* ---------- Menú lateral ---------- */}
        {menuMovil && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenuMovil(false)} />}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-marino-950 text-white transition-all lg:sticky lg:top-3 lg:h-[calc(100vh-1.5rem)] lg:translate-x-0 lg:rounded-2xl ${
            menuMovil ? "translate-x-0" : "-translate-x-full"
          } ${compacto ? "w-[76px]" : "w-64"}`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 p-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white p-1">
                <Image src="/logos/Comalba_Grupo_sf.png" alt="" width={60} height={40} className="h-auto w-full object-contain" />
              </span>
              {!compacto && <span className="truncate font-semibold">Grupo Comalba</span>}
            </Link>
            <button
              onClick={() => (menuMovil ? setMenuMovil(false) : setCompacto((c) => !c))}
              aria-label={menuMovil ? "Cerrar menú" : compacto ? "Expandir menú" : "Contraer menú"}
              className="grid size-7 shrink-0 place-items-center rounded-md bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              {menuMovil ? <X size={15} /> : <ChevronLeft size={15} className={compacto ? "rotate-180" : ""} />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            <ItemMenu icono={LayoutDashboard} texto="Resumen" activo={vista === "resumen"} compacto={compacto} onClick={() => irA("resumen")} />
            <ItemMenu icono={Building2} texto="Publicaciones" activo={vista === "publicaciones"} compacto={compacto} onClick={() => irA("publicaciones")} total={activas.length} />
            <ItemMenu icono={Star} texto="Destacadas en inicio" activo={vista === "destacadas"} compacto={compacto} onClick={() => irA("destacadas")} total={`${destacadas.length}/${MAX_DESTACADAS}`} />
            <ItemMenu icono={Trash2} texto="Papelera" activo={vista === "papelera"} compacto={compacto} onClick={() => irA("papelera")} total={papelera.length || undefined} />
            <div className="my-3 border-t border-white/10" />
            <ItemMenu icono={Inbox} texto="Solicitudes" compacto={compacto} proximamente />
            <ItemMenu icono={Users} texto="Usuarios" compacto={compacto} proximamente />
          </nav>

          <div className="flex items-center gap-3 border-t border-white/10 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-dorado-500 text-sm font-bold text-marino-950">DG</span>
            {!compacto && (
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold">Dirección General</span>
                <span className="block truncate text-xs text-white/50">Sesión de prueba</span>
              </span>
            )}
          </div>
        </aside>

        {/* ---------- Contenido ---------- */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <header className="flex items-center justify-between gap-3 bg-white px-4 py-4 sm:px-6 lg:rounded-2xl">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuMovil(true)} aria-label="Abrir menú" className="grid size-10 place-items-center rounded-xl border border-marino-950/10 lg:hidden">
                <Menu size={18} />
              </button>
              <h1 className="text-2xl font-bold text-marino-900 sm:text-3xl">{titulos[vista]}</h1>
            </div>
            <div className="flex items-center gap-2">
              <EnlaceSitio href="/" texto="Sitio Comalba" />
              <EnlaceSitio href={CATALOGOS[filtros.seccion].href} texto={CATALOGOS[filtros.seccion].texto} />
              <button
                onClick={() => document.getElementById("buscador")?.focus()}
                aria-label="Buscar"
                className="grid size-11 place-items-center rounded-xl border border-marino-950/10 text-piedra transition hover:text-marino-900"
              >
                <Search size={18} />
              </button>
              <button disabled title="Notificaciones de solicitudes (próximamente)" aria-label="Notificaciones" className="grid size-11 place-items-center rounded-xl border border-marino-950/10 text-piedra/50">
                <Bell size={18} />
              </button>
            </div>
          </header>

          <main className="flex-1 bg-white p-4 sm:p-6 lg:rounded-2xl">
            <div className="mb-5 rounded-xl border border-dorado-500/40 bg-dorado-500/10 px-4 py-2.5 text-sm text-marino-900">
              <strong>Versión de prueba:</strong> los cambios se guardan solo en este navegador. Al conectar el servidor se verán en todos los dispositivos.
            </div>

            {vista === "resumen" ? (
              <Resumen
                activas={activas}
                destacadas={destacadas.length}
                papelera={papelera.length}
                verSeccion={(seccion) => {
                  elegirSeccion(seccion);
                  irA("publicaciones");
                }}
              />
            ) : (
              <>
                {/* Barra de acciones */}
                <div className="flex flex-wrap gap-3">
                  <label className="relative min-w-60 flex-1">
                    <span className="sr-only">Buscar</span>
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piedra" />
                    <input
                      id="buscador"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar por clave, título o zona"
                      className="h-12 w-full rounded-xl border border-marino-950/12 bg-white pl-11 pr-4 text-[15px] outline-none transition focus:border-marino-900"
                    />
                  </label>
                  <button
                    onClick={() => setVerFiltros((v) => !v)}
                    aria-expanded={verFiltros}
                    className={`inline-flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                      verFiltros || hayFiltros ? "border-dorado-500 bg-dorado-500/10 text-marino-900" : "border-marino-950/12 text-marino-900 hover:border-marino-900"
                    }`}
                  >
                    <Filter size={17} className={hayFiltros ? "fill-dorado-500 text-dorado-600" : ""} /> Filtros
                  </button>
                  <button
                    onClick={() => exportarExcel(lista)}
                    disabled={!lista.length}
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-marino-950/12 px-5 text-sm font-semibold text-marino-900 transition hover:border-marino-900 disabled:opacity-40"
                  >
                    <Upload size={17} /> Exportar a Excel
                  </button>
                  <button onClick={crear} className="inline-flex h-12 items-center gap-2 rounded-xl bg-marino-900 px-5 text-sm font-bold text-white transition hover:bg-marino-700">
                    <Plus size={18} /> Crear publicación
                  </button>
                </div>

                {/* División */}
                <div role="tablist" aria-label="División" className="no-scrollbar mt-5 flex gap-1 overflow-x-auto rounded-xl bg-[#f4f5f8] p-1">
                  {([["", "Todas"], ...SECCIONES.map((x) => [x.id, x.nombre])] as ["" | Seccion, string][]).map(([id, nombre]) => (
                    <button
                      key={id || "todas"}
                      role="tab"
                      aria-selected={filtros.seccion === id}
                      onClick={() => elegirSeccion(id)}
                      className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        filtros.seccion === id ? "bg-white text-marino-900 shadow-sm" : "text-piedra hover:text-marino-900"
                      }`}
                    >
                      {nombre} <span className="ml-1 text-xs font-normal text-piedra">{enVista(id)}</span>
                    </button>
                  ))}
                </div>

                {/* Filtros: cambian según la división elegida */}
                {verFiltros && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFiltros(borrador);
                    }}
                    className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]"
                  >
                    {ver.operacion && (
                      <SelectFiltro
                        etiqueta="Tipo de renta"
                        valor={borrador.operacion}
                        onCambio={(v) => setBorrador({ ...borrador, operacion: v, precio: "", huespedes: "" })}
                        opciones={[["Renta anual", "Renta anual"], ["Renta vacacional", "Renta vacacional"]]}
                        vacio="Ambas"
                      />
                    )}
                    <SelectFiltro
                      etiqueta={borrador.seccion === "aqmen" ? "Tipo de proyecto" : "Categoría"}
                      valor={borrador.categoria}
                      onCambio={(v) => setBorrador({ ...borrador, categoria: v })}
                      opciones={(borrador.seccion === "aqmen" ? CATEGORIAS_AQMEN : borrador.seccion ? CATEGORIAS : [...CATEGORIAS, ...CATEGORIAS_AQMEN]).map((c) => [c, c])}
                      vacio="Todas"
                    />
                    {ver.recamaras && (
                      <SelectFiltro etiqueta="Recámaras" valor={borrador.recamaras} onCambio={(v) => setBorrador({ ...borrador, recamaras: v })} opciones={[["1", "1+"], ["2", "2+"], ["3", "3+"], ["4", "4+"]]} />
                    )}
                    {ver.banos && (
                      <SelectFiltro etiqueta="Baños" valor={borrador.banos} onCambio={(v) => setBorrador({ ...borrador, banos: v })} opciones={[["1", "1+"], ["2", "2+"], ["3", "3+"]]} />
                    )}
                    {ver.huespedes && (
                      <SelectFiltro etiqueta="Huéspedes" valor={borrador.huespedes} onCambio={(v) => setBorrador({ ...borrador, huespedes: v })} opciones={[["2", "2+"], ["4", "4+"], ["6", "6+"], ["10", "10+"]]} />
                    )}
                    {ver.m2 && (
                      <SelectFiltro etiqueta="Superficie" valor={borrador.m2} onCambio={(v) => setBorrador({ ...borrador, m2: v })} opciones={SUPERFICIES.map((r) => [r.id, r.texto])} />
                    )}
                    {ver.precio && (
                      <SelectFiltro
                        etiqueta={escalaPrecio(borrador) === "venta" ? "Precio" : escalaPrecio(borrador) === "noche" ? "Precio por noche" : "Renta mensual"}
                        valor={borrador.precio}
                        onCambio={(v) => setBorrador({ ...borrador, precio: v })}
                        opciones={[...PRECIOS[escalaPrecio(borrador)].map((r) => [r.id, r.texto]), ["sin", "Sin precio"]]}
                      />
                    )}
                    <SelectFiltro
                      etiqueta="Estado"
                      valor={borrador.estado}
                      onCambio={(v) => setBorrador({ ...borrador, estado: v })}
                      opciones={[["publicada", "Publicada"], ["oculta", "Oculta"], ...(borrador.seccion === "aqmen" ? [] : [["destacada", "Destacada"]])]}
                      vacio="Todas"
                    />
                    <label className="text-sm font-medium text-marino-900">
                      Actualizada desde
                      <input
                        type="date"
                        value={borrador.desde}
                        onChange={(e) => setBorrador({ ...borrador, desde: e.target.value })}
                        className="mt-2 h-11 w-full rounded-xl border border-marino-950/12 bg-white px-3 text-sm text-piedra outline-none focus:border-marino-900"
                      />
                    </label>
                    <div className="col-span-2 flex items-end gap-2 sm:col-span-1">
                      <button type="submit" className="h-11 flex-1 rounded-xl bg-marfil px-5 text-sm font-semibold text-marino-900 transition hover:bg-arena-200">
                        Aplicar
                      </button>
                      {hayFiltros && (
                        <button type="button" onClick={() => elegirSeccion(filtros.seccion)} className="h-11 rounded-xl px-3 text-sm font-semibold text-piedra transition hover:text-marino-900">
                          Limpiar
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Lista */}
                <section className="mt-6 rounded-2xl bg-[#f4f5f8] p-3 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1">
                    <p className="font-semibold text-marino-900">
                      Publicaciones: <span className="font-normal text-piedra">{lista.length}</span>
                    </p>
                    <p className="text-sm text-piedra" aria-live="polite">
                      {aviso}
                    </p>
                  </div>
                  {vista === "destacadas" && (
                    <p className="mb-4 px-1 text-sm text-piedra">
                      El inicio siempre muestra {MAX_DESTACADAS} propiedades: primero estas y, si faltan, las publicadas más recientemente.
                    </p>
                  )}
                  {vista === "papelera" && <p className="mb-4 px-1 text-sm text-piedra">Lo eliminado queda aquí hasta que lo restaures o lo borres definitivamente.</p>}

                  <ul className="space-y-3">
                    {cargando && <li className="h-32 animate-pulse rounded-2xl bg-white" />}
                    {!cargando && !lista.length && (
                      <li className="rounded-2xl border border-dashed border-marino-950/20 bg-white p-10 text-center text-sm text-piedra">
                        {busqueda || hayFiltros ? "No hay publicaciones con esa búsqueda o filtros." : "No hay publicaciones aquí."}
                      </li>
                    )}
                    {lista.map((p) => (
                      <Fila
                        key={p.id}
                        p={p}
                        onEditar={() => setEditando({ publicacion: p, esNueva: false })}
                        onDestacar={() => alternarDestacada(p)}
                        onPublicar={() => guardar({ ...p, publicada: !p.publicada }, p.publicada ? `${p.clave} quedó oculta.` : `${p.clave} ya está publicada.`)}
                        onPapelera={() => guardar({ ...p, eliminadaEn: new Date().toISOString(), destacada: false }, `${p.clave} se movió a la papelera.`)}
                        onRestaurar={() => guardar({ ...p, eliminadaEn: null, publicada: false }, `${p.clave} se restauró como oculta. Publícala cuando esté lista.`)}
                        onBorrar={() => borrarDefinitivo(p)}
                      />
                    ))}
                  </ul>
                </section>
              </>
            )}
          </main>
        </div>
      </div>

      {editando && (
        <EditorPublicacion
          key={editando.publicacion.id}
          inicial={editando.publicacion}
          esNueva={editando.esNueva}
          destacadasLlenas={destacadas.length >= MAX_DESTACADAS && !editando.publicacion.destacada}
          onCerrar={() => setEditando(null)}
          onGuardar={async (p) => {
            await guardar(p, editando.esNueva ? `${p.clave} se creó.` : `${p.clave} se actualizó.`);
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Piezas del panel ---------- */

function ItemMenu({
  icono: Icono,
  texto,
  activo = false,
  compacto,
  onClick,
  total,
  proximamente = false,
}: {
  icono: LucideIcon;
  texto: string;
  activo?: boolean;
  compacto: boolean;
  onClick?: () => void;
  total?: number | string;
  proximamente?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={proximamente}
      title={proximamente ? `${texto} (próximamente)` : texto}
      className={`flex w-full items-center gap-3 rounded-xl p-2 text-left text-[15px] transition ${
        activo ? "bg-white/10 text-arena-300" : proximamente ? "text-white/35" : "text-white/80 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${activo ? "bg-dorado-500 text-marino-950" : "bg-white/10"}`}>
        <Icono size={18} />
      </span>
      {!compacto && (
        <>
          <span className="flex-1 truncate">{texto}</span>
          {proximamente ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Pronto</span>
          ) : (
            total !== undefined && <span className="text-xs text-white/50">{total}</span>
          )}
        </>
      )}
    </button>
  );
}

function EnlaceSitio({ href, texto }: { href: string; texto: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hidden h-11 items-center gap-2.5 rounded-xl border border-marino-950/10 px-4 text-sm font-semibold text-marino-900 transition hover:border-marino-900 md:inline-flex"
    >
      {texto} <ExternalLink size={16} className="text-piedra" />
    </a>
  );
}

function SelectFiltro({
  etiqueta,
  valor,
  onCambio,
  opciones,
  vacio = "—",
}: {
  etiqueta: string;
  valor: string;
  onCambio: (v: string) => void;
  opciones: string[][];
  vacio?: string;
}) {
  return (
    <label className="text-sm font-medium text-marino-900">
      {etiqueta}
      <select
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        className={`mt-2 h-11 w-full appearance-none rounded-xl border border-marino-950/12 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2368717d%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pl-3 pr-9 text-sm outline-none focus:border-marino-900 ${
          valor ? "text-marino-900" : "text-piedra"
        }`}
      >
        <option value="">{vacio}</option>
        {opciones.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}

function Chip({ icono: Icono, children }: { icono: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-marino-950/10 px-2 py-1 text-xs font-medium text-marino-900">
      <Icono size={14} className="text-piedra" /> {children}
    </span>
  );
}

function BotonIcono({ etiqueta, onClick, children, peligro = false }: { etiqueta: string; onClick: () => void; children: ReactNode; peligro?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={etiqueta}
      title={etiqueta}
      className={`grid size-10 place-items-center rounded-xl border border-marino-950/10 text-piedra transition ${
        peligro ? "hover:border-red-200 hover:bg-red-50 hover:text-red-700" : "hover:border-marino-900 hover:text-marino-900"
      }`}
    >
      {children}
    </button>
  );
}

function Fila({
  p,
  onEditar,
  onDestacar,
  onPublicar,
  onPapelera,
  onRestaurar,
  onBorrar,
}: {
  p: Publicacion;
  onEditar: () => void;
  onDestacar: () => void;
  onPublicar: () => void;
  onPapelera: () => void;
  onRestaurar: () => void;
  onBorrar: () => void;
}) {
  const m2 = p.construccionM2 ?? p.terrenoM2;
  const estado = p.eliminadaEn
    ? { texto: "En papelera", punto: "bg-red-500", color: "text-red-700" }
    : p.publicada
      ? { texto: "Publicada", punto: "bg-emerald-500", color: "text-emerald-700" }
      : { texto: "Oculta", punto: "bg-piedra", color: "text-piedra" };

  return (
    <li className="flex flex-col gap-4 rounded-2xl bg-white p-3 sm:flex-row">
      <div className="relative h-44 shrink-0 overflow-hidden rounded-xl bg-crema sm:h-28 sm:w-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.fotos[0] && <img src={p.fotos[0]} alt="" className="h-full w-full object-cover" />}
        <span className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold ${estado.color}`}>
          <span className={`size-1.5 rounded-full ${estado.punto}`} /> {estado.texto}
        </span>
        {p.destacada && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-marino-900 px-2 py-0.5 text-[10px] font-bold text-arena-200">
            <Star size={11} className="fill-current" /> Inicio
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <p className="truncate text-lg font-semibold text-marino-900">{p.titulo}</p>
        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-piedra">
          <MapPin size={15} className="shrink-0 text-dorado-600" /> {ubicacionTexto(p)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-lg bg-marino-900 px-2 py-1 font-mono text-xs font-semibold text-white">{p.clave}</span>
          <span className="inline-flex items-center rounded-lg bg-marfil px-2 py-1 text-xs font-semibold text-marino-900">
            {nombreSeccion(p.seccion)} · {p.operacion === "Proyecto" ? p.categoria : `${p.operacion} · ${p.categoria}`}
          </span>
          {p.recamaras !== null && <Chip icono={BedDouble}>{p.recamaras}</Chip>}
          {p.banos !== null && <Chip icono={Bath}>{p.banos}</Chip>}
          {m2 !== null && <Chip icono={Maximize2}>{m2} m²</Chip>}
          <Chip icono={Camera}>{p.fotos.length}</Chip>
          <Chip icono={CalendarClock}>{fecha(p.actualizadaEn)}</Chip>
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-between sm:py-1">
        <div className="flex gap-2">
          {p.eliminadaEn ? (
            <>
              <BotonIcono etiqueta="Restaurar" onClick={onRestaurar}>
                <RotateCcw size={17} />
              </BotonIcono>
              <BotonIcono etiqueta="Eliminar para siempre" onClick={onBorrar} peligro>
                <Trash2 size={17} />
              </BotonIcono>
            </>
          ) : (
            <>
              {p.seccion !== "aqmen" && (
                <BotonIcono etiqueta={p.destacada ? "Quitar del inicio" : "Destacar en el inicio"} onClick={onDestacar}>
                  <Star size={17} className={p.destacada ? "fill-dorado-500 text-dorado-600" : ""} />
                </BotonIcono>
              )}
              <BotonIcono etiqueta={p.publicada ? "Ocultar" : "Publicar"} onClick={onPublicar}>
                {p.publicada ? <EyeOff size={17} /> : <Eye size={17} />}
              </BotonIcono>
              <BotonIcono etiqueta="Editar" onClick={onEditar}>
                <Pencil size={17} />
              </BotonIcono>
              <BotonIcono etiqueta="Mover a la papelera" onClick={onPapelera} peligro>
                <Trash2 size={17} />
              </BotonIcono>
            </>
          )}
        </div>
        <p className="text-lg font-bold text-marino-900">{precioTexto(p)}</p>
      </div>
    </li>
  );
}

function Resumen({ activas, destacadas, papelera, verSeccion }: { activas: Publicacion[]; destacadas: number; papelera: number; verSeccion: (s: Seccion) => void }) {
  const tarjetas = [
    { titulo: "Publicadas", valor: activas.filter((p) => p.publicada).length, detalle: "Visibles para el público" },
    { titulo: "Ocultas", valor: activas.filter((p) => !p.publicada).length, detalle: "Guardadas sin mostrar" },
    { titulo: "Destacadas en inicio", valor: `${destacadas}/${MAX_DESTACADAS}`, detalle: "Aparecen al abrir la página" },
    { titulo: "En papelera", valor: papelera, detalle: "Se pueden restaurar" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((t) => (
          <div key={t.titulo} className="rounded-2xl bg-[#f4f5f8] p-5">
            <p className="text-sm font-semibold text-piedra">{t.titulo}</p>
            <p className="mt-2 text-4xl font-bold text-marino-900">{t.valor}</p>
            <p className="mt-1 text-xs text-piedra">{t.detalle}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {SECCIONES.map((s) => {
          const deSeccion = activas.filter((p) => p.seccion === s.id);
          return (
            <div key={s.id} className="rounded-2xl border border-marino-950/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-600">{s.detalle}</p>
              <p className="mt-1 text-xl font-bold text-marino-900">{s.nombre}</p>
              <p className="mt-3 text-sm text-piedra">
                {deSeccion.filter((p) => p.publicada).length} publicadas · {deSeccion.filter((p) => !p.publicada).length} ocultas
              </p>
              <button onClick={() => verSeccion(s.id)} className="mt-4 text-sm font-semibold text-marino-900 underline-offset-4 hover:underline">
                Ver publicaciones de {s.nombre} →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
