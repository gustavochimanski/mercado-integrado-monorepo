// src/components/Header/HeaderComponent.tsx
import React, { useEffect, useState } from "react";
import { SearchBarComponent } from "./Search";
import { MapPinCheck } from "lucide-react";
import { getCliente, setEnderecoPadraoId } from "@cardapio/stores/client/ClientStore";
import { EnderecoOut, useQueryEnderecos } from "@cardapio/services/useQueryEndereco";

const HeaderComponent = () => {
  const { tokenCliente, enderecoPadraoId } = getCliente();
  const [enderecoAtual, setEnderecoAtual] = useState<EnderecoOut | null>(null);

  // Query de endereços do cliente
  const { data: enderecos } = useQueryEnderecos(tokenCliente, { enabled: !!tokenCliente });

  useEffect(() => {
    if (!tokenCliente) return; // usuário não logado

    if (!enderecos || enderecos.length === 0) {
      setEnderecoAtual(null); // sem endereço cadastrado
      return;
    }

    // tenta pegar pelo id do endereço padrão
    let endereco = enderecos.find(e => e.id === enderecoPadraoId);

    // se não tiver, pega o que estiver marcado como padrao
    if (!endereco) endereco = enderecos.find(e => e.padrao);

    // se ainda não tiver, pega o primeiro disponível
    if (!endereco) endereco = enderecos[0];

    if (endereco) {
      setEnderecoAtual(endereco);
      setEnderecoPadraoId(endereco.id); // atualiza store
    }
  }, [enderecos, enderecoPadraoId, tokenCliente]);

  // Texto do endereço
  let textoEndereco = "";
  if (!tokenCliente) {
    textoEndereco = "Usuário não logado";
  } else if (!enderecoAtual) {
    textoEndereco = "Nenhum endereço cadastrado";
  } else {
    textoEndereco = `${enderecoAtual.logradouro}, ${enderecoAtual.numero ?? ""}`;
  }

  return (
    <header className="w-full flex flex-col items-center shadow sticky top-0 z-50 bg-background rounded-b-lg p-2 pb-4 gap-2">
      {/* ENDEREÇO */}
      <p
        onClick={() => window.alert("Aqui vai abrir um modal de endereços")}
        className="font-semibold text-gray-500 text-sm flex items-center gap-1 cursor-pointer"
      >
        <MapPinCheck size={15} />
        <u>{textoEndereco}</u>
      </p>

      {/* BARRA DE BUSCA */}
      <SearchBarComponent />
    </header>
  );
};

export default HeaderComponent;
