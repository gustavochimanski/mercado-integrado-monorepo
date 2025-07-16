// Descreve cada perfil do usuário
export interface TypePerfilUsuario {
    id: number;
    nome: string | null;
  }
  
  // Descreve o objeto usuário
  export interface TypeUsuario {
    id: number;
    nome: string;
    empresaId: number;
    perfilsUsuario: TypePerfilUsuario[];
    digital1: string;
    digital2: string;
    digital3: string;
    digital4: string;
    digital5: string;
  }
  
  // A resposta é um array de usuários
  export type TypeUsuariosResponse = TypeUsuario[];
  