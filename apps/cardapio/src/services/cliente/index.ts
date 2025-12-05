// @cardapio/services/cliente/index.ts
import { useCriarCliente } from "./criar-cliente";
import { useLoginDireto } from "./login-direto";

export * from "./types";
export * from "./criar-cliente";
export * from "./login-direto";

// Exportar useMutateCliente como objeto com todas as mutations
export function useMutateCliente() {
  const create = useCriarCliente();
  const loginDireto = useLoginDireto();

  return { create, loginDireto };
}

