"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import CategoryOptions from "@cardapio/components/admin/options/CategoryOptions";
import { ModalEditCategoria } from "@cardapio/components/admin/modals/ModalEditCategoria";
import { ModalEditCategoriaImagem } from "@cardapio/components/admin/modals/ModalEditCategoriaImagem";

interface CategoryCardProps {
  id: number;
  label: string;
  image: string | null;
  href: string;
  empresaId: number;
}

export function CategoryCard({ id, label, image, href, empresaId }: CategoryCardProps) {
  const src = image ?? "/placeholder-categoria.jpg";
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editImageOpen, setEditImageOpen] = useState(false);

  return (
    <div className="relative">
      <Link href={href} className="block group">
        <div className="flex flex-col items-center w-16 gap-1 rounded-lg bg-background hover:bg-muted/50 transition-colors">
          <div className="relative w-full aspect-square rounded-full  overflow-hidden bg-background flex items-center justify-center">
            <Image
              src={src}
              alt={label}
              fill
              sizes="100px"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <span className="block text-center text-xs font-medium text-foreground/80 truncate max-w-full px-1">
            {label}
          </span>
        </div>
      </Link>

      <CategoryOptions
        categoryId={id}
        onEditDetails={() => setEditDetailsOpen(true)}
        onEditImage={() => setEditImageOpen(true)}
        hasImage={!!image}
      />

      <ModalEditCategoria
        open={editDetailsOpen}
        onOpenChange={setEditDetailsOpen}
        empresaId={empresaId}
        categoriaId={id}
      />

      <ModalEditCategoriaImagem
        open={editImageOpen}
        onOpenChange={setEditImageOpen}
        empresaId={empresaId}
        categoriaId={id}
      />
    </div>
  );
}
