import { RegiaoEntrega } from "@supervisor/services/useQueryRegioesEntrega";

// Form usado no react-hook-form representando os campos do formulário de região de entrega
export interface RegiaoEntregaForm {
  cep?: string;
  bairro: string;
  cidade: string;
  uf: string;
  taxa_entrega: number;
  raio_km?: number;
  ativo: boolean;
}

// Props do modal de região de entrega
export interface RegiaoEntregaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regiaoEntrega?: RegiaoEntrega | null;
  empresaId: number;
}