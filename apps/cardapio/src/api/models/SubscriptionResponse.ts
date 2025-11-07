/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubscriptionResponse = {
    id: string;
    empresa_id: string;
    user_id: (string | null);
    event_type: string;
    channel: string;
    channel_config: Record<string, any>;
    active: boolean;
    filters: (Record<string, any> | null);
    created_at: string;
    updated_at: string;
};

