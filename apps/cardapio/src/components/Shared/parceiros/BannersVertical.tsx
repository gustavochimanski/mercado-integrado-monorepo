"use client";

import Link from "next/link";
import Image from "next/image";

interface Banner {
  id: number;
  nome: string;
  imagem: string;
  href_destino?: string | null;
}

interface BannersScrollProps {
  data_banners: Banner[];
  isAdmin?: boolean;
}

export function BannersVerticalScroll({ data_banners, isAdmin = false }: BannersScrollProps) {
  if (!data_banners || data_banners.length === 0) return null;

  return (
    <div className={`overflow-x-auto my-6 ${isAdmin ? "" : "hide-scrollbar"}`}>
      <div className="flex flex-nowrap gap-2">
        {data_banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href_destino ?? "/"} // fallback para "/"
            className="flex-shrink-0 basis-1/4 aspect-[1/2] rounded-lg overflow-hidden shadow-md relative"
          >
            <Image
              src={banner.imagem}
              alt={banner.nome}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={false}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
