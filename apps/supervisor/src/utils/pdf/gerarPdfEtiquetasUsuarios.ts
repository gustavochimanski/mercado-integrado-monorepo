// lib/gerarPdfEtiquetasUsuarios.ts
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";

export type Etiqueta = {
  nome: string;
  codigo: string;
  base64: string; // URL ou data:image/png;base64,...
};

/**
 * Desenha uma etiqueta na página do PDF
 */
async function drawEtiqueta(
  page: PDFPage,
  etiqueta: Etiqueta,
  x: number,
  y: number,
  font: PDFFont,
  pdfDoc: PDFDocument
): Promise<void> {
  const barcodeWidth = 120;
  const barcodeHeight = 50;
  const gap = 5;
  const fontSize = 10;

  // Converte base64 ou URL para ArrayBuffer
  const imageBytes = etiqueta.base64.startsWith("data:")
    ? Uint8Array.from(atob(etiqueta.base64.split(",")[1]), (c) => c.charCodeAt(0))
    : await fetch(etiqueta.base64).then((res) => res.arrayBuffer());

  const image = await pdfDoc.embedPng(imageBytes);
  page.drawImage(image, {
    x,
    y: y - barcodeHeight,
    width: barcodeWidth,
    height: barcodeHeight,
  });

  const textWidth = font.widthOfTextAtSize(etiqueta.nome, fontSize);
  const textX = x + (barcodeWidth - textWidth) / 2;

  page.drawText(etiqueta.nome, {
    x: textX,
    y: y - barcodeHeight - gap - fontSize,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
}

/**
 * Verifica se precisa de uma nova página
 */
function needsNewPage(currentY: number, margin: number, etiquetaHeight: number): boolean {
  return currentY < margin + etiquetaHeight;
}

/**
 * Gera o PDF de etiquetas
 */
export async function gerarPdfEtiquetas(etiquetas: Etiqueta[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 595; // A4
  const pageHeight = 842;
  const margin = 30;
  const etiquetasPorLinha = 3;
  const etiquetaWidth = 170;
  const etiquetaHeight = 100;
  const horizontalGap = 10;
  const verticalGap = 20;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  for (let i = 0; i < etiquetas.length; i++) {
    const etiqueta = etiquetas[i];
    const col = i % etiquetasPorLinha;

    if (i !== 0 && col === 0) {
      currentY -= etiquetaHeight + verticalGap;

      if (needsNewPage(currentY, margin, etiquetaHeight)) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
    }

    const x = margin + col * (etiquetaWidth + horizontalGap);
    const y = currentY;

    await drawEtiqueta(page, etiqueta, x, y, font, pdfDoc);
  }

  const pdfBytes = await pdfDoc.save();

  // Força um Uint8Array explícito
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

}
