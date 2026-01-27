'use server'

import { cookies } from 'next/headers'

const TENANT_COOKIE_NAME = 'tenant_slug'

function normalizeTenantSlug(value: string) {
  const slug = value.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  return slug
}

/**
 * Verifica se a configuração da API está disponível
 * Retorna true se estiver configurada, false caso contrário
 * 
 * Considera inválido se:
 * - Não há tenant na URL (detectado via cookie tenant_slug)
 * - Não há cookie api_base_url
 * - Não há configuração explícita
 */
export async function checkApiConfig(): Promise<{ configured: boolean; error?: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  
  // Se está logado, sempre considera configurado (já passou pela validação antes)
  if (token) {
    return { configured: true }
  }
  
  // Verifica se há configuração explícita via cookies
  const apiBaseUrlCookie = cookieStore.get('api_base_url')?.value
  if (apiBaseUrlCookie) {
    return { configured: true }
  }
  
  // Verifica se há tenant configurado (via cookie do middleware)
  const tenantRaw = cookieStore.get(TENANT_COOKIE_NAME)?.value
  const tenant = tenantRaw ? normalizeTenantSlug(tenantRaw) : null
  if (tenant) {
    return { configured: true }
  }
  
  // Se não tem nenhuma configuração explícita, considera inválido
  return {
    configured: false,
    error: 'Nenhuma configuração de tenant ou API encontrada. O link pode estar inválido.',
  }
}
