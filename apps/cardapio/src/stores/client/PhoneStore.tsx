let telefoneCliente: string = ""; // cache local

export function setTelefoneCliente(telefone: string) {
  if (!telefone || telefone.trim().length < 8) return; // valor inválido
  telefoneCliente = telefone;
  localStorage.setItem("telefoneCliente", telefone);
}

export function getTelefoneCliente(): string {
  if (telefoneCliente) return telefoneCliente;

  const stored = localStorage.getItem("telefoneCliente");
  if (stored) {
    telefoneCliente = stored;
    return stored;
  }

  return "";
}

export function clearTelefoneCliente() {
  telefoneCliente = "";
  localStorage.removeItem("telefoneCliente");
}
