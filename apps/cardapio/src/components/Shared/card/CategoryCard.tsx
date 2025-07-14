"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import CategoryOptions from "@cardapio/components/admin/options/CategoryOptions";
import { ModalEditCategoria } from "@cardapio/components/admin/modals/ModalEditCategoria";

interface CategoryCardProps {
  id: number;
  label: string;
  image: string | null;
  href: string;
  empresaId: number;
}

export function CategoryCard({
  id,
  label,
  image,
  href,
  empresaId,
}: CategoryCardProps) {
  const src = image ?? "/placeholder-categoria.jpg";

  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="relative">
      <Link href={href} className="block group">
        <Card className="bg-muted flex flex-col items-center min-w-[120px] w-[120px] gap-1 p-2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-background flex items-center justify-center">
            <Image
              src={src}
              alt={label}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-105 transition"
            />
          </div>
          <span className="block text-center text-sm font-semibold truncate max-w-full">
            {label}
          </span>
        </Card>
      </Link>

      <CategoryOptions categoryId={id} onEdit={() => setEditOpen(true)} />

      <ModalEditCategoria
        open={editOpen}
        onOpenChange={setEditOpen}
        empresaId={empresaId}
        categoriaId={id}
      />
    </div>
  );
}
