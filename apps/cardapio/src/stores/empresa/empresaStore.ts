let empresaId: number = 0; // valor inicial padrão (0 = não definido)

export function setEmpresaId(id: number) {
  if (isNaN(id) || id <= 0) return; // valor inválido
  empresaId = id;
  localStorage.setItem("empresaId", String(id));
}

export function getEmpresaId(): number {
  if (empresaId > 0) return empresaId;

  const stored = localStorage.getItem("empresaId");
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
  localStorage.removeItem("empresaId");
}
