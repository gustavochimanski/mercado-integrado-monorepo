let empresaId: number = 0; // valor inicial padrão (0 = não definido)
let mesaInicial: { codigo: string | null; numPessoas: number | null } | null = null;

export function setEmpresaId(id: number) {
  const normalized = Number(id);
  if (!Number.isFinite(normalized) || normalized <= 0) return; // valor inválido
  empresaId = normalized;
  try {
    localStorage.setItem("empresaId", String(normalized));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Não foi possível persistir empresaId no localStorage:", error);
    }
  }
}

export function getEmpresaId(): number {
  if (empresaId > 0) return empresaId;

  let stored: string | null = null;
  try {
    stored = localStorage.getItem("empresaId");
  } catch {
    return 0;
  }
  if (stored) {
    const parsed = Number(stored);
    if (!isNaN(parsed) && parsed > 0) {
      empresaId = parsed;
      return parsed;
    }
  }

  return 0; 
}

export function clearEmpresaId() {
  empresaId = 0;
  try {
    localStorage.removeItem("empresaId");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Não foi possível remover empresaId do localStorage:", error);
    }
  }
}

export function setMesaInicial(codigo: string | null, numPessoas?: number | null) {
  mesaInicial = {
    codigo: codigo ?? null,
    numPessoas: typeof numPessoas === "number" && numPessoas > 0 ? Math.trunc(numPessoas) : null,
  };

  try {
    if (mesaInicial.codigo) {
      localStorage.setItem("mesaInicialCodigo", mesaInicial.codigo);
    } else {
      localStorage.removeItem("mesaInicialCodigo");
    }

    if (mesaInicial.numPessoas) {
      localStorage.setItem("mesaInicialNumPessoas", String(mesaInicial.numPessoas));
    } else {
      localStorage.removeItem("mesaInicialNumPessoas");
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Não foi possível persistir mesa inicial:", error);
    }
  }
}

export function getMesaInicial(): { codigo: string | null; numPessoas: number | null } {
  if (mesaInicial) {
    return mesaInicial;
  }

  try {
    const storedCodigo = localStorage.getItem("mesaInicialCodigo");
    const storedNum = localStorage.getItem("mesaInicialNumPessoas");
    mesaInicial = {
      codigo: storedCodigo ?? null,
      numPessoas: storedNum ? Number(storedNum) || null : null,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Não foi possível ler mesa inicial do localStorage:", error);
    }
    mesaInicial = { codigo: null, numPessoas: null };
  }

  return mesaInicial!;
}

export function clearMesaInicial() {
  mesaInicial = { codigo: null, numPessoas: null };
  try {
    localStorage.removeItem("mesaInicialCodigo");
    localStorage.removeItem("mesaInicialNumPessoas");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Não foi possível limpar mesa inicial do localStorage:", error);
    }
  }
}
