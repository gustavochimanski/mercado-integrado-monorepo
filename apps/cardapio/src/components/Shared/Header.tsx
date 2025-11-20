// src/components/Header/HeaderComponent.tsx
import { useEffect, useState } from "react";
import { CircleArrowLeft,Search } from "lucide-react";
import { getCliente, setEnderecoPadraoId } from "@cardapio/stores/client/ClientStore";
import { EnderecoOut, useQueryEnderecos } from "@cardapio/services/enderecos/useQueryEndereco";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";

const HeaderComponent = () => {
  const [clienteData, setClienteData] = useState<{ tokenCliente?: string; enderecoPadraoId?: number } | null>(null);
  const [enderecoAtual, setEnderecoAtual] = useState<EnderecoOut | null>(null);

  const router = useRouter();
  const pathname = usePathname(); // rota atual

  // Carrega dados do cliente apenas no cliente
  useEffect(() => {
    const { tokenCliente, enderecoPadraoId } = getCliente();
    setClienteData({ tokenCliente, enderecoPadraoId });
  }, []);

  // Query de endereços do cliente
  const { data: enderecos } = useQueryEnderecos({ enabled: !!clienteData?.tokenCliente });

  useEffect(() => {
    if (!clienteData?.tokenCliente) return; // usuário não logado

    if (!enderecos || enderecos.length === 0) {
      setEnderecoAtual(null); // sem endereço cadastrado
      return;
    }

    // tenta pegar pelo id do endereço padrão
    let endereco = enderecos.find(e => e.id === clienteData?.enderecoPadraoId);

    // se não tiver, pega o que estiver marcado como padrao
    if (!endereco) endereco = enderecos.find(e => e.padrao);

    // se ainda não tiver, pega o primeiro disponível
    if (!endereco) endereco = enderecos[0];

    if (endereco) {
      setEnderecoAtual(endereco);
      setEnderecoPadraoId(endereco.id); // atualiza store
    }
  }, [enderecos, clienteData?.enderecoPadraoId, clienteData?.tokenCliente]);

  // Texto do endereço
  let textoEndereco = "";
  if (!clienteData?.tokenCliente) {
    textoEndereco = "Usuário não logado";
  } else if (!enderecoAtual) {
    textoEndereco = "Nenhum endereço cadastrado";
  } else {
    textoEndereco = `${enderecoAtual.logradouro}, ${enderecoAtual.numero ?? ""}`;
  }

  return (
    <header className="w-full flex flex-row items-center sticky  top-0 z-50 bg-background rounded-b-lg p-1  gap-2">
      {/* ENDEREÇO */}
      {/* <p
        onClick={() => window.alert("Aqui vai abrir um modal de endereços")}
        className="font-semibold text-gray-500 text-sm flex items-center gap-1 cursor-pointer"
      >
        <MapPinCheck size={15} />
        <u>{textoEndereco}</u>
      </p> */}

      {/* Só mostra se não estiver na "/" */}
      {pathname !== "/" && (
        <Button onClick={router.back} variant="link" className="mr-auto">
          <CircleArrowLeft /> Voltar
        </Button>
      )}

      {/* BARRA DE BUSCA */}
      <div className={`relative flex-1 ${pathname === "/" ? "max-w-none" : "max-w-md"}`}>
        <form className="relative">
          <Input
            type="search"
            placeholder="Buscar produtos, categorias..."
            className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-sm"
            aria-label="Buscar"
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
