/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationChannel } from './NotificationChannel';
import type { NotificationPriority } from './NotificationPriority';
import type { NotificationStatus } from './NotificationStatus';
export type NotificationResponse = {
    id: string;
    empresa_id: string;
    user_id: (string | null);
    event_type: string;
    event_data: (Record<string, any> | null);
    title: string;
    message: string;
    channel: NotificationChannel;
    status: NotificationStatus;
    priority: NotificationPriority;
    recipient: string;
    channel_metadata: (Record<string, any> | null);
    attempts: number;
    max_attempts: number;
    last_attempt_at: (string | null);
    next_retry_at: (string | null);
    created_at: string;
    sent_at: (string | null);
    failed_at: (string | null);
};

