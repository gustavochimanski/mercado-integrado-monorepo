/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Resposta da operação de impressão da Printer API
 */
export type RespostaImpressaoPrinter = {
    /**
     * Se a impressão foi bem-sucedida
     */
    sucesso: boolean;
    /**
     * Mensagem de resultado
     */
    mensagem: string;
    /**
     * Número do pedido impresso
     */
    numero_pedido?: (number | null);
    /**
     * Timestamp da impressão
     */
    timestamp?: (string | null);
};

