import { NextRequest } from 'next/server'

const TENANT_COOKIE_NAME = 'tenant_slug'
const LOGGED_IN_TENANT_COOKIE_NAME = 'logged_in_tenant'
const LOGGED_IN_API_BASE_URL_COOKIE_NAME = 'logged_in_api_base_url'

function normalizeTenantSlug(value: string) {
  const slug = value.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  return slug
}

/**
 * Versão para middleware que aceita NextRequest
 */
export function getApiBaseUrlFromRequest(request: NextRequest): string {
  const token = request.cookies.get('access_token')?.value
  
  // Se usuário está LOGADO, usa o tenant/base URL do login (nunca muda)
  if (token) {
    // Prioridade: cookie salvo no login
    const loggedInApiBaseUrl = request.cookies.get(LOGGED_IN_API_BASE_URL_COOKIE_NAME)?.value
    if (loggedInApiBaseUrl) {
      return loggedInApiBaseUrl.replace(/\/$/, '')
    }
    
    // Fallback: tenant salvo no login
    const loggedInTenant = request.cookies.get(LOGGED_IN_TENANT_COOKIE_NAME)?.value
    if (loggedInTenant) {
      const baseDomain = process.env.MENSURA_API_BASE_DOMAIN || 'mensuraapi.com.br'
      return `https://${loggedInTenant}.${baseDomain}`
    }
    
    // Se não tem cookie de login mas está logado, lança erro
    throw new Error(
      'Base da API não definida para usuário logado. Faça logout e login novamente.'
    )
  }
  
  // Se usuário está DESLOGADO, detecta da rota atual ou override
  // 0) Prioridade máxima: override explícito via cookie (sincronizado do localStorage)
  const apiBaseUrlCookie = request.cookies.get('api_base_url')?.value
  if (apiBaseUrlCookie) {
    return apiBaseUrlCookie.replace(/\/$/, '')
  }

  // 1) Fallback: cookie persistido pelo middleware (derivado de /{tenant}/...)
  const tenantRaw = request.cookies.get(TENANT_COOKIE_NAME)?.value
  let tenant = tenantRaw ? normalizeTenantSlug(tenantRaw) : null

  const baseDomain = process.env.MENSURA_API_BASE_DOMAIN || 'mensuraapi.com.br'

  if (tenant) {
    return `https://${tenant}.${baseDomain}`
  }

  // 2) Fallback: supervisor envia /?empresa=X&via=supervisor&tenant=slug (ou /landingpage-store?...&tenant=slug)
  //    sem passar por /{tenant} — usa tenant da query para chamar a API
  const apiBaseFromQuery = request.nextUrl.searchParams.get('api_base_url')?.trim()
  if (apiBaseFromQuery && /^https?:\/\//.test(apiBaseFromQuery)) {
    return apiBaseFromQuery.replace(/\/$/, '')
  }
  const tenantFromQuery = request.nextUrl.searchParams.get('tenant')?.trim()
  tenant = tenantFromQuery ? normalizeTenantSlug(tenantFromQuery) : null
  if (tenant) {
    return `https://${tenant}.${baseDomain}`
  }

  // Se não tem nenhuma configuração, lança erro
  throw new Error(
    'Base da API não definida: defina cookie tenant_slug (via rota /{slug}), cookie api_base_url ou ?tenant=slug na URL.'
  )
}
