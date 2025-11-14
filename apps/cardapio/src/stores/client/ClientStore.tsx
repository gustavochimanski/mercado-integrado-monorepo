// ClientStore.ts
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export interface ClienteStore {
  id?: number;               // id do cliente (quando vem da API)
  nome?: string;
  telefone?: string;         // telefone do cliente
  email?: string;
  cpf_cnpj?: string | null;

  tokenCliente?: string;     // super token do cliente
  enderecoPadraoId?: number; // último endereço usado/salvo
  meioPagamentoId?: number;  // último meio de pagamento escolhido
}

const SUPER_TOKEN_COOKIE_KEY = "super_token";

let clienteCache: ClienteStore = {}; // cache em memória
const STORAGE_KEY = "clienteStore";

// 🔎 Carrega do localStorage ao iniciar
function loadFromStorage(): ClienteStore {
  if (Object.keys(clienteCache).length > 0) return clienteCache;

  // Verificar se está no cliente antes de acessar localStorage
  if (typeof window === 'undefined') {
    return {};
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      clienteCache = JSON.parse(stored) as ClienteStore;
      return clienteCache;
    } catch {
      return {};
    }
  }

  return {};
}

function saveToStorage(data: ClienteStore) {
  clienteCache = { ...data };
  
  // Verificar se está no cliente antes de acessar localStorage
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clienteCache));
}

// --- API do Store ---

export function getCliente(): ClienteStore {
  const cliente = loadFromStorage();
  
  // Se não tiver tokenCliente no storage, tenta buscar do cookie
  if (!cliente.tokenCliente) {
    const cookieToken = getCookie(SUPER_TOKEN_COOKIE_KEY);
    if (typeof cookieToken === "string" && cookieToken) {
      cliente.tokenCliente = cookieToken;
      // Sincroniza com storage
      saveToStorage({ ...cliente, tokenCliente: cookieToken });
    }
  }
  
  return cliente;
}

export function setCliente(partial: Partial<ClienteStore>) {
  const current = loadFromStorage();
  const updated = { ...current, ...partial };
  saveToStorage(updated);
  
  // Se o super_token foi atualizado, salva também no cookie
  if (partial.tokenCliente) {
    setCookie(SUPER_TOKEN_COOKIE_KEY, partial.tokenCliente, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
}

export function clearCliente() {
  clienteCache = {};
  
  // Verificar se está no cliente antes de acessar localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  
  deleteCookie(SUPER_TOKEN_COOKIE_KEY, { path: "/" });
}

// Helpers individuais para super token
export function getTokenCliente(): string {
  const cliente = getCliente();
  if (cliente.tokenCliente) return cliente.tokenCliente;
  
  // Fallback: busca do cookie diretamente
  const cookieToken = getCookie(SUPER_TOKEN_COOKIE_KEY);
  return typeof cookieToken === "string" ? cookieToken : "";
}

export function setTokenCliente(token: string) {
  if (!token || token.trim().length < 8) return;
  setCliente({ tokenCliente: token });
}

// Helpers para endereço/meio de pagamento continuam iguais
export function getEnderecoPadraoId(): number | null {
  return getCliente().enderecoPadraoId ?? null;
}
export function setEnderecoPadraoId(id: number) {
  setCliente({ enderecoPadraoId: id });
}

export function getMeioPagamentoId(): number | null {
  return getCliente().meioPagamentoId ?? null;
}
export function setMeioPagamentoId(id: number) {
  setCliente({ meioPagamentoId: id });
}
