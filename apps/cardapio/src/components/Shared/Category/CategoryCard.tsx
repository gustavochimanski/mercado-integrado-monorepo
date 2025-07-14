import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import CategoryOptions from "@cardapio/components/admin/options/CategoryOptions";


interface CategoryCardProps {
  label: string;
  image: string | null;
  href: string;
}

export function CategoryCard({ label, image, href }: CategoryCardProps) {
  const src = image ?? "/placeholder-categoria.jpg";

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
      <CategoryOptions/>

    </div>
  );
}



