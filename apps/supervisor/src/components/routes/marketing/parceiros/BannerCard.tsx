"use client";

import Image from "next/image";
import { Button } from "@supervisor/components/ui/button";
import { Card, CardFooter } from "@supervisor/components/ui/card";
import { Badge } from "@supervisor/components/ui/badge";
import { BannerParceiroOut } from "@supervisor/services/useQueryParceiros";

interface BannerCardProps {
  banner: BannerParceiroOut;
  onEdit: (banner: BannerParceiroOut) => void;
  onRemove: (bannerId: number) => void;
}


export function BannerCard({ banner, onEdit, onRemove }: BannerCardProps) {
  return (
    <div className="relative">
      <Card
        className="aspect-[1/2] max-h-[400px] flex flex-col justify-between overflow-hidden p-2 gap-2 cursor-pointer hover:shadow-md transition-shadow duration-200"
      >
        {/* Imagem com badge */}
        <div className="relative w-full aspect-[1/2] rounded-md overflow-hidden">
          <Badge
            className="absolute top-2 left-2 z-10 text-xs"
            variant={banner.tipo_banner === "V" ? "default" : "secondary"}
          >
            {banner.tipo_banner === "V" ? "Vertical" : "Horizontal"}
          </Badge>

          <Image
            src={banner.imagem || "/placeholder.jpg"}
            alt={banner.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 90px"
          />
        </div>

        {/* Título */}
        <h1 className="text-sm font-medium text-start line-clamp-2 mt-1">
          {banner.nome || "Sem nome"}
        </h1>

        {/* Botões */}
        <CardFooter className="flex gap-2 mt-2 p-0">
          <Button
            size="sm"
            className="flex-1 rounded-md text-sm"
            onClick={(e) => { e.stopPropagation(); onEdit(banner); }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 rounded-md text-sm"
            onClick={(e) => { e.stopPropagation(); onRemove(banner.id); }}
          >
            Remover
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
