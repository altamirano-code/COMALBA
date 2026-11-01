"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import {
  MAX_FOTOS,
  OPERACIONES,
  SECCIONES,
  categoriasDe,
  type Publicacion,
  type Seccion,
} from "@/lib/publicaciones";

/* Reduce cada foto a máx. 1600 px en JPG para no saturar el almacenamiento */
async function comprimir(archivo: File): Promise<string> {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, 1600 / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  lienzo.getContext("2d")!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  return lienzo.toDataURL("image/jpeg", 0.8);
}

const entrada =
  "mt-1.5 w-full rounded-lg border border-marino-950/15 bg-white px-3 py-2.5 text-[15px] font-normal text-tinta outline-none transition focus:border-dorado-600 focus:ring-4 focus:ring-dorado-500/15";

function Campo({ etiqueta, children, ancho = false }: { etiqueta: string; children: ReactNode; ancho?: boolean }) {
  return (
    <label className={`block text-sm font-semibold text-marino-900 ${ancho ? "sm:col-span-2" : ""}`}>
      {etiqueta}
      {children}
    </label>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl bg-white p-5 ring-1 ring-marino-950/10 sm:p-6">
      <legend className="sr-only">{titulo}</legend>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-dorado-600">{titulo}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

const aNumero = (v: string) => (v.trim() === "" ? null : Number(v));

type Props = {
  inicial: Publicacion;
  esNueva: boolean;
  destacadasLlenas: boolean; // Ya hay 4 destacadas y esta no es una de ellas
  onGuardar: (p: Publicacion) => Promise<void>;
  onCerrar: () => void;
};

export function EditorPublicacion({ inicial, esNueva, destacadasLlenas, onGuardar, onCerrar }: Props) {
  const [p, setP] = useState(inicial);
  const [extras, setExtras] = useState(inicial.extras.join(", "));
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState("");

  const cambiar = <K extends keyof Publicacion>(campo: K, valor: Publicacion[K]) => setP((x) => ({ ...x, [campo]: valor }));
  const numero = (campo: "precio" | "terrenoM2" | "construccionM2" | "recamaras" | "banos" | "estacionamientos" | "huespedes") => ({
    type: "number",
    min: 0,
    step: campo === "banos" ? 0.5 : 1,
    value: p[campo] ?? "",
    onChange: (e: ChangeEvent<HTMLInputElement>) => cambiar(campo, aNumero(e.target.value)),
    className: entrada,
  });

  const esAqmen = p.seccion === "aqmen";
  const esVivienda = ["Casa", "Departamento"].includes(p.categoria);

  function cambiarSeccion(seccion: Seccion) {
    setP((x) => ({
      ...x,
      seccion,
      operacion: OPERACIONES[seccion][0],
      categoria: categoriasDe(seccion).includes(x.categoria) ? x.categoria : categoriasDe(seccion)[0],
      destacada: seccion === "aqmen" ? false : x.destacada,
    }));
  }

  async function agregarFotos(archivos: File[]) {
    if (!archivos.length) return;
    const espacio = MAX_FOTOS - p.fotos.length;
    const elegidas = archivos.filter((a) => a.type.startsWith("image/")).slice(0, espacio);
    if (archivos.length > espacio) setAviso(`Solo se agregaron ${espacio} fotos: el máximo es ${MAX_FOTOS} por publicación.`);
    setSubiendo(true);
    try {
      const nuevas = await Promise.all(elegidas.map(comprimir));
      setP((x) => ({ ...x, fotos: [...x.fotos, ...nuevas].slice(0, MAX_FOTOS) }));
    } catch {
      setAviso("No se pudo leer alguna de las fotos. Intenta con JPG o PNG.");
    } finally {
      setSubiendo(false);
    }
  }

  function moverFoto(i: number, dir: -1 | 1) {
    setP((x) => {
      const fotos = [...x.fotos];
      [fotos[i], fotos[i + dir]] = [fotos[i + dir], fotos[i]];
      return { ...x, fotos };
    });
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!p.fotos.length) {
      setAviso("Agrega al menos una fotografía.");
      return;
    }
    setGuardando(true);
    try {
      await onGuardar({
        ...p,
        titulo: p.titulo.trim(),
        extras: extras.split(",").map((x) => x.trim()).filter(Boolean),
      });
    } catch {
      setAviso("No se pudo guardar. Revisa el espacio disponible del navegador.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-marino-950/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="editor-titulo">
      <form onSubmit={enviar} className="flex h-full w-full max-w-3xl flex-col bg-marfil shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-marino-950/10 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-piedra">{esNueva ? "Nueva publicación" : `Editando ${p.clave}`}</p>
            <h2 id="editor-titulo" className="font-display text-2xl font-semibold text-marino-900">
              {p.titulo || "Sin título"}
            </h2>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar sin guardar" className="grid size-10 place-items-center rounded-full text-piedra transition hover:bg-marfil hover:text-marino-900">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <Bloque titulo="Dónde se publica">
            <div className="sm:col-span-2">
              <div className="grid gap-2 sm:grid-cols-3">
                {SECCIONES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={p.seccion === s.id}
                    onClick={() => cambiarSeccion(s.id)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      p.seccion === s.id ? "border-marino-900 bg-marino-900 text-white" : "border-marino-950/15 text-marino-900 hover:border-marino-900"
                    }`}
                  >
                    <span className="block font-bold">{s.nombre}</span>
                    <span className={`block text-xs ${p.seccion === s.id ? "text-white/70" : "text-piedra"}`}>{s.detalle}</span>
                  </button>
                ))}
              </div>
            </div>
            {OPERACIONES[p.seccion].length > 1 && (
              <Campo etiqueta="Operación">
                <select value={p.operacion} onChange={(e) => cambiar("operacion", e.target.value as Publicacion["operacion"])} className={entrada}>
                  {OPERACIONES[p.seccion].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Campo>
            )}
            <Campo etiqueta={esAqmen ? "Tipo de proyecto" : "Categoría"}>
              <select value={p.categoria} onChange={(e) => cambiar("categoria", e.target.value)} className={entrada}>
                {categoriasDe(p.seccion).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Campo>
          </Bloque>

          <Bloque titulo="Datos generales">
            <Campo etiqueta="Título *" ancho>
              <input required maxLength={100} value={p.titulo} onChange={(e) => cambiar("titulo", e.target.value)} className={entrada} placeholder="Casa con jardín en Cuernavaca" />
            </Campo>
            <Campo etiqueta="Descripción" ancho>
              <textarea rows={4} value={p.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} className={`${entrada} resize-y`} placeholder="Lo más importante del inmueble, en pocas líneas." />
            </Campo>
            <Campo etiqueta="Clave de la propiedad">
              <input value={p.clave} onChange={(e) => cambiar("clave", e.target.value.toUpperCase())} className={entrada} />
            </Campo>
          </Bloque>

          <Bloque titulo={esAqmen ? "Precio (opcional)" : "Precio"}>
            <Campo etiqueta={p.operacion === "Renta anual" ? "Renta mensual (MXN)" : p.operacion === "Renta vacacional" ? "Precio por noche (MXN)" : "Precio (MXN)"}>
              <input {...numero("precio")} placeholder="Vacío = Consultar precio" />
            </Campo>
            <label className="flex items-center gap-2.5 self-end pb-3 text-sm font-semibold text-marino-900">
              <input type="checkbox" checked={p.precioDesde} onChange={(e) => cambiar("precioDesde", e.target.checked)} className="size-4 accent-marino-900" />
              Mostrar como “Desde”
            </label>
            {!esAqmen && (
              <Campo etiqueta="Forma de pago" ancho>
                <input value={p.formaPago} onChange={(e) => cambiar("formaPago", e.target.value)} className={entrada} placeholder="Contado, crédito bancario, Infonavit…" />
              </Campo>
            )}
          </Bloque>

          <Bloque titulo="Ubicación">
            <Campo etiqueta="Colonia o fraccionamiento">
              <input value={p.colonia} onChange={(e) => cambiar("colonia", e.target.value)} className={entrada} />
            </Campo>
            <Campo etiqueta="Municipio">
              <input value={p.municipio} onChange={(e) => cambiar("municipio", e.target.value)} className={entrada} />
            </Campo>
            <Campo etiqueta="Estado">
              <input value={p.estado} onChange={(e) => cambiar("estado", e.target.value)} className={entrada} />
            </Campo>
            {!esAqmen && (
              <Campo etiqueta="Enlace de Google Maps">
                <input type="url" value={p.mapa} onChange={(e) => cambiar("mapa", e.target.value)} className={entrada} placeholder="https://maps.google.com/…" />
              </Campo>
            )}
          </Bloque>

          {!esAqmen && (
            <Bloque titulo="Características">
              <Campo etiqueta="Terreno (m²)">
                <input {...numero("terrenoM2")} />
              </Campo>
              <Campo etiqueta="Construcción (m²)">
                <input {...numero("construccionM2")} />
              </Campo>
              {esVivienda && (
                <>
                  <Campo etiqueta="Recámaras">
                    <input {...numero("recamaras")} />
                  </Campo>
                  <Campo etiqueta="Baños">
                    <input {...numero("banos")} />
                  </Campo>
                </>
              )}
              <Campo etiqueta="Estacionamientos">
                <input {...numero("estacionamientos")} />
              </Campo>
              {p.operacion === "Renta vacacional" && (
                <Campo etiqueta="Huéspedes máximos">
                  <input {...numero("huespedes")} />
                </Campo>
              )}
              <Campo etiqueta="Características adicionales (separadas por coma)" ancho>
                <input value={extras} onChange={(e) => setExtras(e.target.value)} className={entrada} placeholder="Alberca, jardín, seguridad 24 h" />
              </Campo>
            </Bloque>
          )}

          <fieldset className="rounded-2xl bg-white p-5 ring-1 ring-marino-950/10 sm:p-6">
            <legend className="sr-only">Fotografías</legend>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-dorado-600">Fotografías *</h3>
              <span className="text-xs font-semibold text-piedra">
                {p.fotos.length}/{MAX_FOTOS} · la primera es la portada
              </span>
            </div>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {p.fotos.map((foto, i) => (
                <li key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-crema">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-marino-900 px-1.5 py-0.5 text-[10px] font-bold text-white">Portada</span>}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/60 p-1.5">
                    <span className="flex gap-1">
                      <button type="button" disabled={i === 0} onClick={() => moverFoto(i, -1)} aria-label="Mover a la izquierda" className="grid size-7 place-items-center rounded bg-white/90 text-marino-900 disabled:opacity-30">
                        <ArrowLeft size={14} />
                      </button>
                      <button type="button" disabled={i === p.fotos.length - 1} onClick={() => moverFoto(i, 1)} aria-label="Mover a la derecha" className="grid size-7 place-items-center rounded bg-white/90 text-marino-900 disabled:opacity-30">
                        <ArrowRight size={14} />
                      </button>
                    </span>
                    <button type="button" onClick={() => cambiar("fotos", p.fotos.filter((_, j) => j !== i))} aria-label="Quitar foto" className="grid size-7 place-items-center rounded bg-white/90 text-red-700">
                      <X size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {p.fotos.length < MAX_FOTOS && (
                <li>
                  <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-marino-950/20 text-center text-xs font-semibold text-piedra transition hover:border-marino-900 hover:text-marino-900">
                    <span>
                      {subiendo ? <Loader2 className="mx-auto mb-1 animate-spin" size={20} /> : <ImagePlus className="mx-auto mb-1" size={20} />}
                      {subiendo ? "Procesando…" : "Agregar fotos"}
                    </span>
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                        agregarFotos([...(e.target.files ?? [])]);
                        e.target.value = "";
                      }} />
                  </label>
                </li>
              )}
            </ul>
            <label className="mt-5 block text-sm font-semibold text-marino-900">
              Video o recorrido virtual (enlace)
              <input type="url" value={p.video} onChange={(e) => cambiar("video", e.target.value)} className={entrada} placeholder="https://youtube.com/…" />
            </label>
          </fieldset>

          <Bloque titulo="Publicación">
            <label className="flex items-start gap-3 text-sm text-marino-900">
              <input type="checkbox" checked={p.publicada} onChange={(e) => cambiar("publicada", e.target.checked)} className="mt-0.5 size-4 accent-marino-900" />
              <span>
                <span className="block font-semibold">Publicada</span>
                <span className="text-piedra">Si la desmarcas, queda oculta para el público.</span>
              </span>
            </label>
            {!esAqmen && (
              <label className={`flex items-start gap-3 text-sm text-marino-900 ${destacadasLlenas && !p.destacada ? "opacity-50" : ""}`}>
                <input
                  type="checkbox"
                  checked={p.destacada}
                  disabled={destacadasLlenas && !p.destacada}
                  onChange={(e) => cambiar("destacada", e.target.checked)}
                  className="mt-0.5 size-4 accent-dorado-600"
                />
                <span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Star size={14} className="text-dorado-600" /> Destacar en el inicio
                  </span>
                  <span className="text-piedra">{destacadasLlenas && !p.destacada ? "Ya hay 4 destacadas. Quita una para elegir esta." : "Máximo 4 en el inicio."}</span>
                </span>
              </label>
            )}
          </Bloque>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-marino-950/10 bg-white px-6 py-4">
          <p className="text-sm text-red-700" aria-live="polite">
            {aviso}
          </p>
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={onCerrar} className="rounded-full px-5 py-2.5 text-sm font-semibold text-piedra transition hover:text-marino-900">
              Cancelar
            </button>
            <button type="submit" disabled={guardando || subiendo} className="rounded-full bg-marino-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-marino-700 disabled:opacity-50">
              {guardando ? "Guardando…" : esNueva ? "Crear publicación" : "Guardar cambios"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
