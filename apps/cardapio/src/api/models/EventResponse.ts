/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventResponse = {
    id: string;
    empresa_id: string;
    event_type: string;
    event_id: (string | null);
    data: Record<string, any>;
    event_metadata: (Record<string, any> | null);
    processed: boolean;
    processed_at: (string | null);
    created_at: string;
};

