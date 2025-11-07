/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSubscriptionRequest = {
    /**
     * ID da empresa
     */
    empresa_id: string;
    /**
     * ID do usuário (opcional para configuração global)
     */
    user_id?: (string | null);
    /**
     * Tipo do evento a ser monitorado
     */
    event_type: string;
    /**
     * Canal de notificação
     */
    channel: string;
    /**
     * Configurações do canal
     */
    channel_config: Record<string, any>;
    /**
     * Se a assinatura está ativa
     */
    active?: boolean;
    /**
     * Filtros para envio da notificação
     */
    filters?: (Record<string, any> | null);
};

