// ClientStore.ts
export interface ClienteStore {
  id?: number;              // id do cliente (quando vem da API)
  nome?: string;
  telefone?: string;
  email?: string;
  cpf_cnpj?: string;

  enderecoPadraoId?: number; // último endereço usado/salvo
  meioPagamentoId?: number;  // último meio de pagamento escolhido
}

let clienteCache: ClienteStore = {}; // cache em memória

const STORAGE_KEY = "clienteStore";

// 🔎 Carrega do localStorage ao iniciar
function loadFromStorage(): ClienteStore {
  if (Object.keys(clienteCache).length > 0) return clienteCache;

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clienteCache));
}

// --- API do Store ---

export function getCliente(): ClienteStore {
  return loadFromStorage();
}

export function setCliente(partial: Partial<ClienteStore>) {
  const current = loadFromStorage();
  const updated = { ...current, ...partial };
  saveToStorage(updated);
}

export function clearCliente() {
  clienteCache = {};
  localStorage.removeItem(STORAGE_KEY);
}

// Helpers individuais
export function getTelefoneCliente(): string {
  return getCliente().telefone ?? "";
}
export function setTelefoneCliente(telefone: string) {
  if (!telefone || telefone.trim().length < 8) return;
  setCliente({ telefone });
}

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
