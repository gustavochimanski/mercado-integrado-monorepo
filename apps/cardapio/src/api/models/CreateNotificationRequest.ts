/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationChannel } from './NotificationChannel';
import type { NotificationPriority } from './NotificationPriority';
export type CreateNotificationRequest = {
    /**
     * ID da empresa
     */
    empresa_id: string;
    /**
     * ID do usuário (opcional)
     */
    user_id?: (string | null);
    /**
     * Tipo do evento que gerou a notificação
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
     * Canal de notificação
     */
    channel: NotificationChannel;
    /**
     * Destinatário da notificação
     */
    recipient: string;
    /**
     * Prioridade da notificação
     */
    priority?: NotificationPriority;
    /**
     * Metadados específicos do canal
     */
    channel_metadata?: (Record<string, any> | null);
    /**
     * Número máximo de tentativas
     */
    max_attempts?: number;
};

