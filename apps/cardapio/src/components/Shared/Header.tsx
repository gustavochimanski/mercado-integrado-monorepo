"use client";

import { useEffect, useState, useCallback } from "react";
import { CircleArrowLeft, Search } from "lucide-react";
import { getCliente, setEnderecoPadraoId } from "@cardapio/stores/client/ClientStore";
import { EnderecoOut, useQueryEnderecos } from "@cardapio/services/enderecos/useQueryEndereco";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { getEmpresaId, getEmpresaData } from "@cardapio/stores/empresa/empresaStore";
import { LojaStatus } from "./LojaStatus";

const HeaderComponent = () => {
  const [clienteData, setClienteData] = useState<{ tokenCliente?: string; enderecoPadraoId?: number } | null>(null);
  const [enderecoAtual, setEnderecoAtual] = useState<EnderecoOut | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";

  const isHomeOrCategory = pathname === "/" || pathname.startsWith("/categoria");
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

  // Buscar dados da empresa para exibir status (apenas no cliente)
  const [empresaData, setEmpresaData] = useState<ReturnType<typeof getEmpresaData>>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setEmpresaData(getEmpresaData());
  }, []);

  if (isFinalizarPedido) return null;

  // Verificar se há parâmetro redireciona_categoria na URL
  const redirecionaCategoria = searchParams.get("redireciona_categoria") === "true";

  return (
    <header className="w-full flex flex-row items-center sticky top-0 z-50 bg-background rounded-b-lg p-1 gap-2">
      {pathname !== "/" && !redirecionaCategoria && (
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

      {/* Status discreto da loja - apenas no cliente para evitar erro de hidratação */}
      {isMounted && empresaData?.horarios_funcionamento && (
        <div className="ml-auto">
          <LojaStatus horarios={empresaData.horarios_funcionamento} />
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
