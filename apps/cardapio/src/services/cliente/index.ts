// @cardapio/services/cliente/index.ts
import { useCriarCliente } from "./criar-cliente";
import { useAtualizarCliente } from "./atualizar-cliente";
import { useEnviarCodigo } from "./enviar-codigo";
import { useConfirmarCodigo } from "./confirmar-codigo";
import { useLoginDireto } from "./login-direto";

export * from "./types";
export * from "./criar-cliente";
export * from "./atualizar-cliente";
export * from "./enviar-codigo";
export * from "./confirmar-codigo";
export * from "./login-direto";

// Exportar useMutateCliente como objeto com todas as mutations
export function useMutateCliente() {
  const create = useCriarCliente();
  const update = useAtualizarCliente();
  const enviarCodigoNovoDispositivo = useEnviarCodigo();
  const confirmarCodigo = useConfirmarCodigo();
  const loginDireto = useLoginDireto();

  return { create, update, enviarCodigoNovoDispositivo, confirmarCodigo, loginDireto };
}

