/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCardPioMinIoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Corrigir Permissoes Buckets
     * Corrige permissões de todos os buckets do MinIO para permitir acesso público às imagens.
     * Útil para resolver erros de "Access Denied" ao acessar imagens.
     * @returns any Successful Response
     * @throws ApiError
     */
    public corrigirPermissoesBucketsApiCardapioAdminMinioCorrigirPermissoesPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/minio/corrigir-permissoes',
        });
    }
    /**
     * Corrigir Bucket Empresa
     * Corrige permissões do bucket MinIO para uma empresa específica desconhecida.
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public corrigirBucketEmpresaApiCardapioAdminMinioCorrigirEmpresaEmpresaIdPost(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/minio/corrigir-empresa/{empresa_id}',
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
    public verificarBucketEmpresaApiCardapioAdminMinioVerificarBucketEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/minio/verificar-bucket/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
