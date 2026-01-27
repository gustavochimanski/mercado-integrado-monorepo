import { cookies } from 'next/headers'

const TENANT_COOKIE_NAME = 'tenant_slug'
const LOGGED_IN_TENANT_COOKIE_NAME = 'logged_in_tenant'
const LOGGED_IN_API_BASE_URL_COOKIE_NAME = 'logged_in_api_base_url'

function normalizeTenantSlug(value: string) {
  const slug = value.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  return slug
}

/**
 * Retorna a base URL do backend a partir do tenant atual (server-side).
 *
 * Regras:
 * 1. Se usuário está LOGADO (tem access_token):
 *    - Usa o tenant/base URL que foi salvo no login (nunca muda)
 *    - Ignora qualquer mudança de rota
 * 2. Se usuário está DESLOGADO:
 *    - Detecta tenant da rota atual (/{tenant}/...)
 *    - Ou usa override explícito via cookie
 */
export async function getApiBaseUrl(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  
  // Se usuário está LOGADO, usa o tenant/base URL do login (nunca muda)
  if (token) {
    // Prioridade: cookie salvo no login
    const loggedInApiBaseUrl = cookieStore.get(LOGGED_IN_API_BASE_URL_COOKIE_NAME)?.value
    if (loggedInApiBaseUrl) {
      return loggedInApiBaseUrl.replace(/\/$/, '')
    }
    
    // Fallback: tenant salvo no login
    const loggedInTenant = cookieStore.get(LOGGED_IN_TENANT_COOKIE_NAME)?.value
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
  const apiBaseUrlCookie = cookieStore.get('api_base_url')?.value
  if (apiBaseUrlCookie) {
    return apiBaseUrlCookie.replace(/\/$/, '')
  }

  // 1) Fallback: cookie persistido pelo middleware (derivado de /{tenant}/...)
  const tenantRaw = cookieStore.get(TENANT_COOKIE_NAME)?.value
  const tenant = tenantRaw ? normalizeTenantSlug(tenantRaw) : null

  const baseDomain = process.env.MENSURA_API_BASE_DOMAIN || 'mensuraapi.com.br'

  if (tenant) {
    return `https://${tenant}.${baseDomain}`
  }

  // Se não tem nenhuma configuração, lança erro
  throw new Error(
    'Base da API não definida: defina cookie tenant_slug (via rota /{slug}) ou cookie api_base_url.'
  )
}
