/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMinIoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Corrigir Permissoes Buckets
     * Corrige permissões de todos os buckets do MinIO para permitir acesso público às imagens.
     * Útil para resolver erros de "Access Denied" ao acessar imagens.
     * @returns any Successful Response
     * @throws ApiError
     */
    public corrigirPermissoesBucketsApiDeliveryAdminMinioCorrigirPermissoesPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/minio/corrigir-permissoes',
        });
    }
    /**
     * Corrigir Bucket Empresa
     * Corrige permissões do bucket MinIO para uma empresa específica desconhecida.
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public corrigirBucketEmpresaApiDeliveryAdminMinioCorrigirEmpresaEmpresaIdPost(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/minio/corrigir-empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verificar Bucket Empresa
     * Verifica o status do bucket MinIO de uma empresa específica.
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public verificarBucketEmpresaApiDeliveryAdminMinioVerificarBucketEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/minio/verificar-bucket/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
