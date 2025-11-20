"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ComboMiniDTO } from "@cardapio/services/home";
import { SheetAdicionarCombo } from "./SheetAddCombo";

type Props = {
  combo: ComboMiniDTO;
  onSelectCombo?: (combo: ComboMiniDTO) => void;
  empresa_id?: number;
  vitrineId?: number;
};

export function ComboCard({ combo, onSelectCombo, empresa_id, vitrineId }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const price = Number(combo.preco_total) || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSheetOpen(true);
  };

  const handleCardClick = () => {
    setSheetOpen(true);
  };

  return (
    <div className="relative">
      <Card
        className="w-[120px] h-[180px] flex flex-col overflow-hidden gap-0 p-0 cursor-pointer hover:shadow-lg transition-all duration-200 rounded-lg border-0 shadow-md bg-white"
        onClick={handleCardClick}
      >
        {/* Imagem principal */}
        <div className="relative w-full h-[100px] overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={combo.imagem || "/semimagem.png"}
            alt={combo.titulo || "Combo"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </div>

        {/* Informações do combo */}
        <div className="flex flex-col p-1 flex-1 min-h-0 bg-white">
          <h1 className="text-xs font-medium leading-tight text-gray-900 mb-auto">
            {combo.titulo || "Sem nome"}
          </h1>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-sm font-bold text-gray-900 leading-none">
              R$ {price.toFixed(2).replace(".", ",")}
            </p>
            <Button
              size="sm"
              className="w-7 h-7 p-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all flex-shrink-0"
              onClick={handleAdd}
            >
              <span className="text-base font-bold leading-none">+</span>
            </Button>
          </div>
        </div>
      </Card>
      <SheetAdicionarCombo
        combo={combo}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

