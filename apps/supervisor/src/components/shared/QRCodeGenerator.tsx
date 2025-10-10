"use client";

import { useEffect, useRef } from "react";
// @ts-ignore
import bwipjs from "bwip-js";
import { generateCupomLink } from "@supervisor/services/useQueryCupons";

interface QRCodeGeneratorProps {
  cupom?: {
    codigo: string;
  };
  cardapioLink?: string;
  url?: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({ cupom, cardapioLink, url, size = 150, className = "" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Gera o link automaticamente se um cupom for fornecido
  const finalUrl = cupom ? generateCupomLink(cupom.codigo, cardapioLink) : url;

  useEffect(() => {
    if (canvasRef.current && finalUrl) {
      try {
        // Limpa o canvas
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, size, size);
        }

        // Gera o QR code usando bwip-js
        bwipjs.toCanvas(canvasRef.current, {
          bcid: "qrcode", // Tipo: QR Code
          text: finalUrl,
          scale: 3,
          width: size,
          height: size,
          includetext: false,
          textxalign: "center",
        });
      } catch (error) {
        console.error("Erro ao gerar QR code:", error);
      }
    }
  }, [finalUrl, size]);

  if (!finalUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-500 text-sm">Sem link</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ width: size, height: 'auto' }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-200 rounded"
        style={{ width: size, height: size }}
      />
      <p className="text-xs text-gray-500 mt-1 text-center max-w-[120px] break-all">
        {finalUrl.length > 20 ? `${finalUrl.substring(0, 20)}...` : finalUrl}
      </p>
      {cupom && (
        <p className="text-xs text-blue-600 mt-1 font-medium text-center">
          Cupom: {cupom.codigo}
        </p>
      )}
    </div>
  );
}
