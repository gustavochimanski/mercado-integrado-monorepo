import React from "react";
import { ProdutoEmpMini } from "../../../types/Produtos";
import { ProductCard } from "../ProductCard";
import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/controlls/SecaoSubCategOptions";

interface Props {
  categoriaLabel?: string;
  produtos: ProdutoEmpMini[];
  onAdd?: (p: ProdutoEmpMini) => void;
  subcategoriaId: number;
  codCategoria: number; // ✅ NOVO
}

export default React.memo(function CategorySection({
  categoriaLabel,
  produtos,
  onAdd,
  subcategoriaId,
  codCategoria, // ✅
}: Props) {
  return (
    <section className="mb-6">
      {categoriaLabel && (
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-2 px-2">{categoriaLabel}</h2>
          <AdminSecaoSubCategOptions />
        </div>
      )}

      <div className="flex overflow-x-auto items-stretch gap-2 pb-2 hide-scrollbar px-2">
        {produtos.map((p) => (
          <div key={p.cod_barras} className="snap-start flex flex-col h-full">
            <ProductCard produto={p} onAdd={() => onAdd?.(p)} />
          </div>
        ))}

        <CardAddProduto
          empresaId={1}
          codCategoria={codCategoria}   // ✅ Agora vai!
          subcategoriaId={subcategoriaId}
        />
      </div>
    </section>
  );
});
