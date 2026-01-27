"use client";

import { useEffect, useState, useCallback } from "react";
import { CircleArrowLeft, Search } from "lucide-react";
import { getCliente, setEnderecoPadraoId } from "@cardapio/stores/client/ClientStore";
import { EnderecoOut, useQueryEnderecos } from "@cardapio/services/enderecos/useQueryEndereco";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

const HeaderComponent = () => {
  const [clienteData, setClienteData] = useState<{ tokenCliente?: string; enderecoPadraoId?: number } | null>(null);
  const [enderecoAtual, setEnderecoAtual] = useState<EnderecoOut | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";

  const isHomeOrCategory =
    pathname === "/" || pathname.startsWith("/categoria") || pathname.startsWith("/landingpage-store");
  const isFinalizarPedido = pathname === "/finalizar-pedido";

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const term = searchValue.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      if (isHomeOrCategory) {
        router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
        return;
      }

      const empresaId = getEmpresaId();
      const nextParams = new URLSearchParams();
      if (term) nextParams.set("q", term);
      if (empresaId) nextParams.set("empresa", String(empresaId));
      router.push(nextParams.toString() ? `/?${nextParams.toString()}` : "/");
    },
    [searchValue, pathname, searchParams, isHomeOrCategory, router]
  );

  useEffect(() => {
    const { tokenCliente, enderecoPadraoId } = getCliente();
    setClienteData({ tokenCliente, enderecoPadraoId });
  }, []);

  const { data: enderecos } = useQueryEnderecos({ enabled: !!clienteData?.tokenCliente });

  useEffect(() => {
    if (!clienteData?.tokenCliente) return;
    if (!enderecos || enderecos.length === 0) {
      setEnderecoAtual(null);
      return;
    }
    let endereco = enderecos.find((e) => e.id === clienteData?.enderecoPadraoId);
    if (!endereco) endereco = enderecos.find((e) => e.padrao);
    if (!endereco) endereco = enderecos[0];
    if (endereco) {
      setEnderecoAtual(endereco);
      setEnderecoPadraoId(endereco.id);
    }
  }, [enderecos, clienteData?.enderecoPadraoId, clienteData?.tokenCliente]);

  if (isFinalizarPedido) return null;

  return (
    <header className="w-full flex flex-row items-center sticky top-0 z-50 bg-background rounded-b-lg p-1 gap-2">
      {pathname !== "/" && !pathname.startsWith("/landingpage-store") && (
        <Button onClick={() => router.back()} variant="link" className="mr-auto">
          <CircleArrowLeft /> Voltar
        </Button>
      )}

      <div className={`relative flex-1 ${pathname === "/" ? "max-w-none" : "max-w-md"}`}>
        <form className="relative" onSubmit={handleSearchSubmit}>
          <Input
            type="search"
            placeholder="Buscar produtos, categorias..."
            className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-sm"
            aria-label="Buscar"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            <Search size={16} />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default HeaderComponent;
