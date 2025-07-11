import { useUserContext } from "@packs/auth";



import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";


interface CategoryCardProps {
  label: string;
  image: string | null;
  href: string;
}

export function CategoryCard({ label, image, href }: CategoryCardProps) {
  const src = image ?? "/placeholder-categoria.jpg";
  const { isAdmin } = useUserContext();

  return (
    <div className="relative">
      {/* Link com Card interno */}
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

      {/* Ícone de admin (apenas se for admin) */}
      {isAdmin && (
        <div className="absolute top-1 right-1 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-sm">
              <DropdownMenuItem onClick={() => alert("Editar categoria")}>
                <Pencil/> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Remover categoria")}>
                <Trash2/> Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
