/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TipoOperacaoMesa } from './TipoOperacaoMesa';
export type MesaHistoricoOut = {
    id: number;
    mesa_id: number;
    cliente_id?: (number | null);
    usuario_id?: (number | null);
    tipo_operacao: TipoOperacaoMesa;
    status_anterior?: (string | null);
    status_novo?: (string | null);
    descricao?: (string | null);
    observacoes?: (string | null);
    ip_origem?: (string | null);
    user_agent?: (string | null);
    created_at: string;
    tipo_operacao_descricao: string;
    resumo_operacao: string;
    usuario?: (string | null);
};

