"use client";

import Link from "next/link";
import Image from "next/image";
import { Banner } from "@cardapio/services/banners";

interface BannersGroupedProps {
  banners: Banner[];
  isAdmin?: boolean;
}

function isExternalUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function buildLandingpageStoreHrefFromBanner(banner: Banner): string {
  const baseHref = banner.href_destino ?? "#";
  if (!baseHref || baseHref === "#") return "/landingpage-store";

  const url = new URL(
    baseHref,
    typeof window !== "undefined" ? window.location.origin : "http://localhost"
  );

  // Normaliza possíveis links internos com prefixo /cardapio
  const pathnameSemPrefixo = url.pathname.startsWith("/cardapio")
    ? url.pathname.replace(/^\/cardapio/, "")
    : url.pathname;

  // Se vier apontando para /categoria/..., espelha o slug em /landingpage-store/...
  if (pathnameSemPrefixo.startsWith("/categoria/")) {
    const rest = pathnameSemPrefixo.replace(/^\/categoria/, "");
    url.pathname = `/landingpage-store${rest}`;
  } else if (!pathnameSemPrefixo.startsWith("/landingpage-store")) {
    // Fallback quando não dá pra inferir slug: vai pra raiz da landingpage-store
    url.pathname = "/landingpage-store";
  }

  // Para rotas internas, retornar apenas pathname + search + hash
  if (!isExternalUrl(baseHref)) {
    return url.pathname + (url.search ?? "") + (url.hash ?? "");
  }

  // Se for externo (pouco provável nesse modo), mantém a URL completa
  return url.toString();
}

function getBannerHref(banner: Banner): string {
  if (banner.landingpage_store) {
    return buildLandingpageStoreHrefFromBanner(banner);
  }
  return banner.href_destino ?? "/";
}

// 🔧 Função para dividir em grupos de tamanho fixo
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Componente para exibir apenas 1 banner vertical
export function BannerVertical({ banner, isAdmin = false }: { banner: Banner | null; isAdmin?: boolean }) {
  if (!banner) return null;

  return (
    <div className={`overflow-x-auto flex flex-nowrap gap-2 my-6 ${isAdmin ? "" : "hide-scrollbar"}`}>
      <Link
        href={getBannerHref(banner)}
        className="flex-shrink-0 basis-1/3 aspect-[1/2] rounded-lg overflow-hidden shadow-md relative"
      >
        <Image
          src={banner.imagem}
          alt={banner.nome}
          fill
          style={{ objectFit: "cover" }}
          sizes="33vw"
          priority
        />
      </Link>
    </div>
  );
}

// Componente para exibir banners horizontais agrupados
export function BannersHorizontal({ banners, isAdmin = false }: { banners: Banner[]; isAdmin?: boolean }) {
  if (!banners || banners.length === 0) return null;

  const bannersAtivos = banners.filter((b) => b.tipo_banner === "H" && b.ativo);
  if (bannersAtivos.length === 0) return null;

  // Agrupar horizontais de 3 em 3
  const horizontalGroups = chunkArray(bannersAtivos, 3);

  return (
    <div className="flex flex-col gap-4 my-6">
      {horizontalGroups.map((group, index) => (
        <div key={index} className="flex flex-col gap-4">
          {group.map((banner) => (
            <Link
              key={banner.id}
              href={getBannerHref(banner)}
              className="w-full aspect-[16/5] rounded-xl overflow-hidden shadow-lg relative"
            >
              <Image
                src={banner.imagem}
                alt={banner.nome}
                fill
                style={{ objectFit: "cover" }}
                sizes="100vw"
              />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// Componente original mantido para compatibilidade (caso seja usado em outros lugares)
export function BannersGrouped({ banners, isAdmin = false }: BannersGroupedProps) {
  if (!banners || banners.length === 0) return null;

  // Filtrar ativos e por tipo
  const bannersVertical = banners.filter((b) => b.tipo_banner === "V" && b.ativo);
  const bannersHorizontal = banners.filter((b) => b.tipo_banner === "H" && b.ativo);

  // Pegar apenas 1 vertical
  const firstVertical = bannersVertical.length > 0 ? bannersVertical[0] : null;

  // Agrupar horizontais de 3 em 3
  const horizontalGroups = chunkArray(bannersHorizontal, 3);

  return (
    <div className="flex flex-col gap-8 my-6">

      {/* ▶ Banner Vertical Único */}
      {firstVertical && (
        <div className={`overflow-x-auto flex flex-nowrap gap-2 ${isAdmin ? "" : "hide-scrollbar"}`}>
          <Link
            key={firstVertical.id}
            href={getBannerHref(firstVertical)}
            className="flex-shrink-0 basis-1/3 aspect-[1/2] rounded-lg overflow-hidden shadow-md relative"
          >
            <Image
              src={firstVertical.imagem}
              alt={firstVertical.nome}
              fill
              style={{ objectFit: "cover" }}
              sizes="33vw"
              priority
            />
          </Link>
        </div>
      )}

      {/* ▶ Grupos de 3 Banners Horizontais */}
      {horizontalGroups.map((group, index) => {
        return (
          <div key={index} className="flex flex-col gap-4">
            {group.map((banner) => (
              <Link
                key={banner.id}
                href={getBannerHref(banner)}
                className="w-full aspect-[16/5] rounded-xl overflow-hidden shadow-lg relative"
              >
                <Image
                  src={banner.imagem}
                  alt={banner.nome}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                />
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
}
