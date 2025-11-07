/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateEventRequest = {
    /**
     * ID da empresa
     */
    empresa_id: string;
    /**
     * Tipo do evento
     */
    event_type: string;
    /**
     * ID do recurso que gerou o evento
     */
    event_id?: (string | null);
    /**
     * Dados do evento
     */
    data: Record<string, any>;
    /**
     * Metadados adicionais
     */
    event_metadata?: (Record<string, any> | null);
};

