/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationStatus } from './NotificationStatus';
export type NotificationLogResponse = {
    id: string;
    notification_id: string;
    status: NotificationStatus;
    message: (string | null);
    error_details: (Record<string, any> | null);
    created_at: string;
};

