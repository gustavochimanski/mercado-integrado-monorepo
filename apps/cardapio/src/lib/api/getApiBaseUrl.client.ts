import { getCookie } from 'cookies-next'

const TENANT_COOKIE_NAME = 'tenant_slug'
const LOGGED_IN_TENANT_COOKIE_NAME = 'logged_in_tenant'
const LOGGED_IN_API_BASE_URL_COOKIE_NAME = 'logged_in_api_base_url'

function normalizeTenantSlug(value: string) {
  const slug = value.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  return slug
}

/**
 * Versão client-side que lê cookies do browser
 */
export function getApiBaseUrlClient(): string {
  // Verifica se está no browser
  if (typeof window === 'undefined') {
    throw new Error('getApiBaseUrlClient só pode ser usado no client-side')
  }

  // Tenta ler access_token do localStorage (via tokenStore)
  let token: string | null = null
  try {
    const tokenStore = localStorage.getItem('userToken')
    if (tokenStore) {
      token = tokenStore
    }
  } catch {
    // Ignora erros ao ler localStorage
  }

  // Se usuário está LOGADO, usa o tenant/base URL do login (nunca muda)
  if (token) {
    // Prioridade: cookie salvo no login
    const loggedInApiBaseUrl = getCookie(LOGGED_IN_API_BASE_URL_COOKIE_NAME) as string | undefined
    if (loggedInApiBaseUrl) {
      return loggedInApiBaseUrl.replace(/\/$/, '')
    }
    
    // Fallback: tenant salvo no login
    const loggedInTenant = getCookie(LOGGED_IN_TENANT_COOKIE_NAME) as string | undefined
    if (loggedInTenant) {
      const baseDomain = process.env.MENSURA_API_BASE_DOMAIN || 'mensuraapi.com.br'
      return `https://${loggedInTenant}.${baseDomain}`
    }
    
    // Acabou de logar (ex.: via=supervisor) e ainda não tem cookies de login — usa a mesma base da sessão atual
    // para que fetchUser() e demais chamadas funcionem até o backend/flow definir os cookies.
  }
  
  // Usuário deslogado OU logado sem cookies de login: detecta da rota atual ou override
  // 0) Em localhost: NEXT_PUBLIC_API_BASE_URL aponta pro backend local (ex.: 172.20.0.1:41154)
  //    assim /xmanski?empresa=1 não manda chamadas para https://xmanski.mensuraapi.com.br
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const devBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()
  if (isLocalhost && devBase && /^https?:\/\//.test(devBase)) {
    return devBase.replace(/\/$/, '')
  }

  // 1) Prioridade máxima: override explícito via cookie (sincronizado do localStorage ou query em /:slug)
  const apiBaseUrlCookie = getCookie('api_base_url') as string | undefined
  if (apiBaseUrlCookie) {
    return apiBaseUrlCookie.replace(/\/$/, '')
  }

  // 2) Fallback: cookie persistido pelo middleware (derivado de /{tenant}/...)
  const tenantRaw = getCookie(TENANT_COOKIE_NAME) as string | undefined
  let tenant = tenantRaw ? normalizeTenantSlug(tenantRaw) : null

  const baseDomain = process.env.MENSURA_API_BASE_DOMAIN || 'mensuraapi.com.br'

  if (tenant) {
    return `https://${tenant}.${baseDomain}`
  }

  // 3) Supervisor envia / ou /landingpage-store sem slug: usa tenant da query (?tenant=slug)
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('via') === 'supervisor') {
    const apiBaseFromQuery = urlParams.get('api_base_url')?.trim()
    if (apiBaseFromQuery && /^https?:\/\//.test(apiBaseFromQuery)) {
      return apiBaseFromQuery.replace(/\/$/, '')
    }
    const tenantFromQuery = urlParams.get('tenant')?.trim()
    tenant = tenantFromQuery ? normalizeTenantSlug(tenantFromQuery) : null
    if (tenant) {
      return `https://${tenant}.${baseDomain}`
    }
  }

  // Se não tem nenhuma configuração, lança erro
  throw new Error(
    'Base da API não definida: defina cookie tenant_slug (via rota /{slug}), cookie api_base_url ou ?tenant=slug na URL.'
  )
}
