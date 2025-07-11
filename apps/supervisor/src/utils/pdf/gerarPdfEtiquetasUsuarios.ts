// lib/gerarPdfEtiquetasUsuarios.ts

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Etiqueta = {
  nome: string;
  codigo: string;
  base64: string;
};

async function drawEtiqueta(
  page: any,
  etiqueta: Etiqueta,
  x: number,
  y: number,
  font: any,
  pdfDoc: PDFDocument
) {
  const barcodeWidth = 120;
  const barcodeHeight = 50;
  const gap = 5;
  const fontSize = 10;

  const imageBytes = await fetch(etiqueta.base64).then((res) => res.arrayBuffer());
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

function needsNewPage(currentY: number, margin: number, etiquetaHeight: number): boolean {
  return currentY < margin + etiquetaHeight;
}

export async function gerarPdfEtiquetas(etiquetas: Etiqueta[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 595;
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
  return new Blob([pdfBytes], { type: "application/pdf" });
}
