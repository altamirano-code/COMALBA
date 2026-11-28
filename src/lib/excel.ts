"use client";

import type { Borders, Cell, Fill, Font } from "exceljs";

/* =========================================================
   EXPORTAR A EXCEL (.xlsx con la imagen de Grupo Comalba)
   Lo usan las exportaciones del panel (publicaciones y solicitudes).
   - Encabezado con logo, título, fecha y total de registros.
   - Tabla con encabezado marino, filas alternadas, filtros y
     encabezado fijo al bajar.
   - Los textos se guardan como texto: Excel nunca los ejecuta
     como fórmula aunque empiecen con = + - @.
   exceljs se descarga solo al exportar, no carga con el panel.
   ========================================================= */

export type ValorExcel = string | number | Date | null | undefined;

export type ColumnaExcel<T> = {
  titulo: string;
  ancho: number; // En caracteres
  valor: (fila: T) => ValorExcel;
  formato?: string; // Formato de número o fecha de Excel
  alinear?: "left" | "center" | "right";
  ajustar?: boolean; // Texto largo en varias líneas (mensajes, detalles)
  etiqueta?: (valor: ValorExcel) => { fondo: string; texto: string } | null; // Píldora de color (Estado, Publicada…)
};

type Opciones<T> = {
  archivo: string; // Sin extensión
  hoja: string;
  titulo: string;
  columnas: ColumnaExcel<T>[];
  filas: T[];
};

/* Colores de la marca (los mismos de globals.css) */
const C = {
  marino: "FF101B2D",
  dorado: "FFB99A63",
  marfil: "FFF7F3EC",
  linea: "FFE6E1D6",
  piedra: "FF5C6470",
  tinta: "FF121A28",
  blanco: "FFFFFFFF",
};

const LOGO = "/logos/grupo-comalba.png"; // 425 × 260, fondo blanco
const FILA_ENCABEZADO = 6;

export const FORMATO_FECHA_HORA = "dd/mm/yyyy hh:mm";
export const FORMATO_FECHA = "dd/mm/yyyy";
export const FORMATO_PESOS = '"$"#,##0';
export const FORMATO_DECIMAL = "#,##0.##";

/* Excel no guarda zona horaria: se corrige para que muestre la hora local y no la de Londres */
export const fechaLocal = (iso: string | null | undefined) => {
  if (!iso) return null;
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
};

/* Colores de las píldoras de estado */
export const ETIQUETA_BIEN = { fondo: "FFE3F4EA", texto: "FF1F6B3A" };
export const ETIQUETA_PENDIENTE = { fondo: "FFFDF1D6", texto: "FF7A5A12" };
export const ETIQUETA_APAGADA = { fondo: "FFECEEF1", texto: "FF5C6470" };

const relleno = (argb: string): Fill => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
const fuente = (extra: Partial<Font> = {}): Partial<Font> => ({ name: "Calibri", size: 11, color: { argb: C.tinta }, ...extra });

async function logoBase64() {
  try {
    const blob = await (await fetch(LOGO)).blob();
    return await new Promise<string>((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(lector.result as string);
      lector.onerror = reject;
      lector.readAsDataURL(blob);
    });
  } catch {
    return null; // Sin logo el archivo se genera igual
  }
}

export async function descargarExcel<T>({ archivo, hoja: nombreHoja, titulo, columnas, filas }: Opciones<T>) {
  const [modulo, logo] = await Promise.all([import("exceljs"), logoBase64()]);
  const ExcelJS = modulo.default ?? modulo; // exceljs es CommonJS: según el empaquetador llega con o sin "default"

  const libro = new ExcelJS.Workbook();
  libro.creator = "Grupo Comalba";
  libro.created = new Date();

  const hoja = libro.addWorksheet(nombreHoja, {
    views: [{ state: "frozen", ySplit: FILA_ENCABEZADO, showGridLines: false }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: `${FILA_ENCABEZADO}:${FILA_ENCABEZADO}` },
  });

  const total = columnas.length;
  // La primera columna lleva el logo encima: necesita un mínimo de ancho
  hoja.columns = columnas.map((c, i) => ({ width: i === 0 ? Math.max(c.ancho, 20) : c.ancho }));

  /* ---------- Encabezado del documento ---------- */
  hoja.getRow(1).height = 30;
  hoja.getRow(2).height = 20;
  hoja.getRow(3).height = 20;
  hoja.getRow(4).height = 10;
  hoja.getRow(5).height = 12;

  const ultima = Math.max(total, 2);
  hoja.mergeCells(1, 2, 1, ultima);
  hoja.mergeCells(2, 2, 2, ultima);
  hoja.mergeCells(3, 2, 3, ultima);

  const celdaTitulo = hoja.getCell(1, 2);
  celdaTitulo.value = titulo;
  celdaTitulo.font = fuente({ size: 18, bold: true, color: { argb: C.marino } });
  celdaTitulo.alignment = { vertical: "bottom" };

  const celdaEmpresa = hoja.getCell(2, 2);
  celdaEmpresa.value = "Grupo Comalba · Panel del equipo";
  celdaEmpresa.font = fuente({ size: 11, bold: true, color: { argb: C.dorado } });

  const generado = new Date().toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" });
  const celdaInfo = hoja.getCell(3, 2);
  celdaInfo.value = `${filas.length} ${filas.length === 1 ? "registro" : "registros"} · Generado el ${generado}`;
  celdaInfo.font = fuente({ size: 10, color: { argb: C.piedra } });

  // Línea dorada bajo el encabezado
  for (let col = 1; col <= ultima; col++) {
    hoja.getCell(4, col).border = { bottom: { style: "medium", color: { argb: C.dorado } } };
  }

  if (logo) {
    const imagen = libro.addImage({ base64: logo, extension: "png" });
    // 425 × 260 a escala: cabe en las filas 1 a 3 (≈ 93 px)
    hoja.addImage(imagen, { tl: { col: 0.15, row: 0.15 }, ext: { width: 130, height: 80 }, editAs: "oneCell" });
  }

  /* ---------- Encabezado de la tabla ---------- */
  const filaTitulos = hoja.getRow(FILA_ENCABEZADO);
  filaTitulos.height = 26;
  columnas.forEach((c, i) => {
    const celda = filaTitulos.getCell(i + 1);
    celda.value = c.titulo;
    celda.font = fuente({ bold: true, color: { argb: C.blanco } });
    celda.fill = relleno(C.marino);
    celda.alignment = { vertical: "middle", horizontal: c.alinear ?? "left", indent: c.alinear === "right" ? 0 : 1 };
    celda.border = { bottom: { style: "medium", color: { argb: C.dorado } } };
  });

  /* ---------- Filas ---------- */
  const lineaInferior: Partial<Borders> = { bottom: { style: "thin", color: { argb: C.linea } } };

  filas.forEach((dato, n) => {
    const fila = hoja.getRow(FILA_ENCABEZADO + 1 + n);
    const alterna = n % 2 === 1;
    let lineas = 1;

    columnas.forEach((c, i) => {
      const celda: Cell = fila.getCell(i + 1);
      const valor = c.valor(dato);
      celda.value = valor === undefined || valor === "" ? null : valor;
      if (c.formato) celda.numFmt = c.formato;
      celda.font = fuente();
      celda.border = lineaInferior;
      celda.alignment = { vertical: c.ajustar ? "top" : "middle", horizontal: c.alinear ?? "left", wrapText: c.ajustar, indent: c.alinear === "right" ? 0 : 1 };
      if (alterna) celda.fill = relleno(C.marfil);

      const color = c.etiqueta?.(valor);
      if (color) {
        celda.fill = relleno(color.fondo);
        celda.font = fuente({ bold: true, color: { argb: color.texto } });
        celda.alignment = { ...celda.alignment, horizontal: "center", indent: 0 };
      }

      // Alto aproximado para los textos largos (Excel no ajusta solo al abrir)
      if (c.ajustar && typeof valor === "string") lineas = Math.max(lineas, Math.ceil(valor.length / Math.max(c.ancho - 2, 10)));
    });

    fila.height = Math.min(20 + (lineas - 1) * 15, 150);
  });

  if (filas.length) {
    hoja.autoFilter = { from: { row: FILA_ENCABEZADO, column: 1 }, to: { row: FILA_ENCABEZADO, column: total } };
  } else {
    const vacia = hoja.getCell(FILA_ENCABEZADO + 1, 1);
    vacia.value = "Sin registros con los filtros actuales.";
    vacia.font = fuente({ italic: true, color: { argb: C.piedra } });
  }

  /* ---------- Descarga ---------- */
  const buffer = await libro.xlsx.writeBuffer();
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  enlace.download = `${archivo}.xlsx`;
  enlace.click();
  // Se libera después: revocarlo de inmediato puede cancelar la descarga en algunos navegadores
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}
