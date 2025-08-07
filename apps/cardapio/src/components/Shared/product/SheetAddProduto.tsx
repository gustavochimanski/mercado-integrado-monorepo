"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

const schema = z.object({
  quantity: z
    .number({ invalid_type_error: "Quantidade inválida" })
    .int()
    .positive()
    .min(1)
    .max(99),
  observacao: z.string().max(200, "Observação muito longa").optional(),
});

type FormData = z.infer<typeof schema>;

interface SheetAdicionarProdutoProps {
  produto: ProdutoEmpMini;
  onAdd?: (produto: ProdutoEmpMini, quantity: number, observacao?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  quickAddQuantity?: number;
}

export function SheetAdicionarProduto({
  produto,
  onAdd,
  isOpen,
  onClose,
  quickAddQuantity = 6,
}: SheetAdicionarProdutoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      observacao: "",
    },
  });

  const quantity = watch("quantity");

  function increment() {
    if (quantity < 99) setValue("quantity", quantity + 1);
  }

  function decrement() {
    if (quantity > 1) setValue("quantity", quantity - 1);
  }

  function addQuickQuantity() {
    const novaQuantidade = Math.min(quantity + quickAddQuantity, 99);
    setValue("quantity", novaQuantidade);
  }

  function onSubmit(data: FormData) {
    onAdd?.(produto, data.quantity, data.observacao);
    onClose();
  }

  const imagem = produto.produto.imagem || "/placeholder.jpg";
  const descricao = produto.produto.descricao || "Sem nome";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle className="flex gap-4 items-center">
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src={imagem}
                  alt={descricao}
                  fill
                  priority
                  className="object-contain rounded-md"
                />
              </div>
              <span className="flex flex-col max-w-[60%] gap-2">
                <span className="font-semibold leading-tight">{descricao}</span>
                <Badge
                  className="w-fit text-xs max-w-full whitespace-nowrap overflow-hidden text-ellipsis"
                  variant="secondary"
                >
                  A partir de 5 Un pague 19,90
                </Badge>
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-2 p-2">
            <Label htmlFor="quantity" className="text-lg">
              Quantidade
            </Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button type="button" className="w-16" onClick={decrement}>
                  -
                </Button>
                <Input
                  type="number"
                  id="quantity"
                  {...register("quantity", { valueAsNumber: true })}
                  className="text-center w-full"
                />
                <Button type="button" className="w-16" onClick={increment}>
                  +
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="text-xs px-3 py-1"
                onClick={addQuickQuantity}
              >
                +{quickAddQuantity} unidades
              </Button>

              {errors.quantity && (
                <p className="text-destructive text-sm">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Campo de observação */}
          <div className="flex flex-col gap-2 px-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              placeholder="Ex: sem cebola, ponto médio, embalagem separada..."
              {...register("observacao")}
              maxLength={200}
            />
            {errors.observacao && (
              <p className="text-destructive text-sm">{errors.observacao.message}</p>
            )}
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full bg-primary text-background">
              Adicionar R$ {(produto.preco_venda * quantity).toFixed(2)}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
