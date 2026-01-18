"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ReceitaMiniDTO } from "@cardapio/services/home";
import { SheetAdicionarReceita } from "./SheetAddReceita";
import { ReceitaOptions } from "@cardapio/components/admin/options/ReceitaOptions";

type Props = {
  receita: ReceitaMiniDTO;
  onSelectReceita?: (receita: ReceitaMiniDTO) => void;
  onEdit?: (receitaId: number) => void;
  empresa_id?: number;
  vitrineId?: number;
};

export function ReceitaCard({ receita, onSelectReceita, onEdit, empresa_id, vitrineId }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const price = Number(receita.preco_venda) || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSheetOpen(true);
  };

  const handleCardClick = () => {
    setSheetOpen(true);
  };

  return (
    <div className="relative">
      <ReceitaOptions
        receitaId={receita.id}
        onEdit={() => onEdit?.(receita.id)}
        vitrineId={vitrineId}
      />
      <Card
        className="w-[120px] h-[180px] flex flex-col overflow-hidden gap-0 p-0 cursor-pointer hover:shadow-lg transition-all duration-200 rounded-lg border-0 shadow-md bg-white"
        onClick={handleCardClick}
      >
        {/* Imagem principal */}
        <div className="relative w-full h-[100px] overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={receita.imagem || "/semimagem.png"}
            alt={receita.nome || receita.descricao || "Receita"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </div>

        {/* Informações da receita */}
        <div className="flex flex-col p-1 flex-1 min-h-0 bg-white">
          <h1 className="text-xs font-medium leading-tight text-gray-900 mb-auto">
            {receita.nome || receita.descricao || "Sem nome"}
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
      <SheetAdicionarReceita
        receita={receita}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

