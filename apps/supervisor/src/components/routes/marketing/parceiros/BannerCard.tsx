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
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Imagem com badge */}
      <div className="relative w-full h-40 overflow-hidden">
        <Badge
          className="absolute top-1 left-1 z-10 text-[10px] px-1.5 py-0.5"
          variant={banner.tipo_banner === "V" ? "default" : "secondary"}
        >
          {banner.tipo_banner === "V" ? "V" : "H"}
        </Badge>

        <Image
          src={banner.imagem || "/placeholder.jpg"}
          alt={banner.nome}
          fill
          className="object-cover"
          sizes="200px"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-2 space-y-2">
        <h1 className="text-xs font-medium line-clamp-1">
          {banner.nome || "Sem nome"}
        </h1>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-[10px] px-2"
            onClick={(e) => { e.stopPropagation(); onEdit(banner); }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 h-7 text-[10px] px-2"
            onClick={(e) => { e.stopPropagation(); onRemove(banner.id); }}
          >
            Remover
          </Button>
        </div>
      </div>
    </Card>
  );
}
