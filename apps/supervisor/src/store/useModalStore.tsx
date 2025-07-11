// Importa a função `create` do Zustand para criar uma store global de estado
import { create } from "zustand";

// Define os tipos dos estados e ações disponíveis na store
type ModalState = {
  // Estados booleanos para controle de visibilidade dos modais
  isEnviarConfiguracaoModalOpen: boolean;
  isEnviarProdutosModalOpen: boolean;
  isReprocessarPdvModalOpen: boolean;

  // Ações para abrir e fechar cada modal
  openEnviarConfig: () => void;
  closeEnviarConfig: () => void;

  openEnviarProdutos: () => void;
  closeEnviarProdutos: () => void;

  openReprocessarPdv: () => void;
  closeReprocessarPdv: () => void;
};

// Cria a store usando `create`, com os estados e métodos definidos
export const useModalStore = create<ModalState>((set) => ({
  // Estado inicial: todos os modais fechados
  isEnviarConfiguracaoModalOpen: false,
  isEnviarProdutosModalOpen: false,
  isReprocessarPdvModalOpen: false,

  // Métodos para controlar o modal de "Enviar Configuração"
  openEnviarConfig: () => set({ isEnviarConfiguracaoModalOpen: true }),
  closeEnviarConfig: () => set({ isEnviarConfiguracaoModalOpen: false }),

  // Métodos para controlar o modal de "Enviar Produtos"
  openEnviarProdutos: () => set({ isEnviarProdutosModalOpen: true }),
  closeEnviarProdutos: () => set({ isEnviarProdutosModalOpen: false }),

  // Métodos para controlar o modal de "Reprocessar PDV"
  openReprocessarPdv: () => set({ isReprocessarPdvModalOpen: true }),
  closeReprocessarPdv: () => set({ isReprocessarPdvModalOpen: false }),
}));
