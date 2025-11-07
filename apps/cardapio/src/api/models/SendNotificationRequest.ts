/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationChannel } from './NotificationChannel';
import type { NotificationPriority } from './NotificationPriority';
export type SendNotificationRequest = {
    /**
     * ID da empresa
     */
    empresa_id: string;
    /**
     * ID do usuário
     */
    user_id?: (string | null);
    /**
     * Tipo do evento
     */
    event_type: string;
    /**
     * Dados do evento
     */
    event_data?: (Record<string, any> | null);
    /**
     * Título da notificação
     */
    title: string;
    /**
     * Mensagem da notificação
     */
    message: string;
    /**
     * Canais para envio
     */
    channels: Array<NotificationChannel>;
    /**
     * Destinatários por canal
     */
    recipients: Record<string, string>;
    /**
     * Prioridade
     */
    priority?: NotificationPriority;
};

