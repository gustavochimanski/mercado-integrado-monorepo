import axios from "axios";
import { getToken } from "@cardapio/stores/token/tokenStore";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type {
  CheckoutGatewayRequest,
  CheckoutGatewayResponse,
  EditarPedidoGatewayRequest,
  EditarPedidoGatewayResponse,
  AtualizarItemGatewayRequest,
  AtualizarItemGatewayResponse,
  AtualizarStatusGatewayRequest,
  AtualizarStatusGatewayResponse,
} from "@cardapio/types/pedido";
import type { Pedido } from "@cardapio/types/pedido";

/**
 * Helper para detectar tipo de autenticação e montar headers apropriados
 * 
 * Prioridade:
 * 1. Se houver token admin (Bearer) → ADMIN
 * 2. Se houver super_token (X-Super-Token) → CLIENT
 * 3. Se nenhum → retorna headers vazios
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Tenta primeiro o token admin (Bearer)
  const adminToken = getToken();
  if (adminToken && adminToken.trim()) {
    headers.Authorization = `Bearer ${adminToken}`;
    return headers;
  }
  
  // Se não tiver admin token, tenta super_token (client)
  const clientToken = getTokenCliente();
  
  if (clientToken && clientToken.trim()) {
    headers["X-Super-Token"] = clientToken.trim();
    return headers;
  }
  
  return headers;
}

/**
 * Realiza checkout através do Gateway Orquestrador
 * 
 * Endpoint: POST /api/gateway/pedidos/checkout
 * 
 * O gateway orquestra pedidos de qualquer tipo (DELIVERY, MESA, BALCAO)
 * e redireciona automaticamente para o sistema apropriado baseado no tipo_pedido:
 * - DELIVERY → /api/delivery/client/pedidos/checkout
 * - MESA/BALCAO → /api/mesas/admin/pedidos
 * 
 * Autenticação:
 * - DELIVERY: Sempre requer token do cliente (X-Super-Token) - obrigatório
 * - MESA/BALCAO: Token opcional (pode usar token ou cliente_id no payload)
 * 
 * Validações:
 * - DELIVERY: requer endereco_id e (meio_pagamento_id OU meios_pagamento[])
 * - MESA: requer mesa_id (obrigatório)
 * - BALCAO: mesa_id é opcional
 * 
 * @param payload - Dados do pedido conforme CheckoutGatewayRequest
 * @param isAdmin - Opcional: força uso de token admin. Se não informado, detecta automaticamente
 * @returns Resposta do gateway com dados do pedido criado (CheckoutGatewayResponse)
 */
export async function checkoutGateway(
  payload: CheckoutGatewayRequest,
  isAdmin?: boolean
): Promise<CheckoutGatewayResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // DELIVERY sempre requer token de cliente
    if (payload.tipo_pedido === "DELIVERY") {
      const clientToken = getTokenCliente();
      
      if (!clientToken || !clientToken.trim()) {
        throw new Error("Cliente não autenticado. Delivery requer token de cliente (X-Super-Token).");
      }
      
      headers["X-Super-Token"] = clientToken.trim();
    } else {
      // MESA/BALCAO: pode usar admin token ou client token (super_token)
      if (isAdmin !== undefined) {
        if (isAdmin) {
          const adminToken = getToken();
          if (!adminToken || !adminToken.trim()) {
            throw new Error("Token de admin não encontrado");
          }
          headers.Authorization = `Bearer ${adminToken}`;
        } else {
          // Força uso de super_token (token cliente)
          const clientToken = getTokenCliente();
          
          if (clientToken && clientToken.trim()) {
            headers["X-Super-Token"] = clientToken.trim();
          }
          // Se não tiver token de cliente, não adiciona header (endpoint aceita sem token para MESA/BALCAO)
        }
      } else {
        // Detecção automática para MESA/BALCAO: prioriza super_token, depois admin token
        const clientToken = getTokenCliente();
        
        if (clientToken && clientToken.trim()) {
          headers["X-Super-Token"] = clientToken.trim();
        } else {
          // Se não tiver super_token, tenta admin token
          const adminToken = getToken();
          if (adminToken && adminToken.trim()) {
            headers.Authorization = `Bearer ${adminToken}`;
          }
          // Se nenhum token for encontrado, não adiciona header (aceito para MESA/BALCAO)
        }
      }
    }
    
    const response = await axios.post<CheckoutGatewayResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/checkout`,
      payload,
      { headers }
    );

    if (response.status === 201 || response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao processar checkout");
  } catch (error: any) {
    // Propaga erros do backend (validações, etc)
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao processar checkout");
  }
}

/**
 * Edita um pedido através do Gateway Orquestrador
 * 
 * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/editar
 * 
 * O gateway detecta automaticamente se é ADMIN ou CLIENT baseado nos headers de autenticação:
 * - ADMIN: Token Bearer no header `Authorization: Bearer {token}` → pode editar qualquer pedido (sem validação de propriedade)
 * - CLIENT: Token no header `X-Super-Token: {token}` → apenas pode editar seus próprios pedidos (validação automática)
 * 
 * Campos que podem ser atualizados:
 * - observacao_geral
 * - meio_pagamento_id
 * - endereco_id
 * - cupom_id
 * - troco_para
 * - tipo_entrega
 * 
 * @param pedidoId - ID do pedido a ser editado
 * @param dados - Dados a serem atualizados no pedido (EditarPedidoGatewayRequest)
 * @param isAdmin - Opcional: força uso de token admin. Se não informado, detecta automaticamente
 * @returns Resposta do gateway com dados do pedido atualizado (EditarPedidoGatewayResponse)
 */
export async function editarPedidoGateway(
  pedidoId: number,
  dados: EditarPedidoGatewayRequest,
  isAdmin?: boolean
): Promise<EditarPedidoGatewayResponse> {
  try {
    const headers: Record<string, string> = {};
    
    // Se isAdmin foi explicitamente informado, usa a lógica específica
    if (isAdmin !== undefined) {
      if (isAdmin) {
        const adminToken = getToken();
        if (!adminToken || !adminToken.trim()) {
          throw new Error("Token de admin não encontrado");
        }
        headers.Authorization = `Bearer ${adminToken}`;
      } else {
        const clientToken = getTokenCliente();
        
        if (!clientToken || !clientToken.trim()) {
          throw new Error("Token de cliente não encontrado");
        }
        headers["X-Super-Token"] = clientToken.trim();
      }
    } else {
      // Detecção automática: prioriza admin, depois client
      const authHeaders = getAuthHeaders();
      Object.assign(headers, authHeaders);
      
      // Garante que pelo menos um token foi fornecido
      if (!headers.Authorization && !headers["X-Super-Token"]) {
        throw new Error("Autenticação necessária. Token de admin ou cliente não encontrado.");
      }
    }
    
    const response = await axios.put<EditarPedidoGatewayResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/editar`,
      dados,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao editar pedido");
  } catch (error: any) {
    // Propaga erros do backend (validações, etc)
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao editar pedido");
  }
}

/**
 * Atualiza itens de um pedido através do Gateway Orquestrador
 * 
 * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/itens
 * 
 * O gateway detecta automaticamente se é ADMIN ou CLIENT baseado nos headers de autenticação:
 * - ADMIN: Token Bearer no header `Authorization: Bearer {token}` → pode atualizar itens de qualquer pedido
 * - CLIENT: Token no header `X-Super-Token: {token}` → apenas pode atualizar itens de seus próprios pedidos
 * 
 * Ações disponíveis:
 * - "adicionar": Adiciona um novo item ao pedido (requer produto_cod_barras e quantidade)
 * - "atualizar": Atualiza um item existente (requer id e campos a atualizar)
 * - "remover": Remove um item do pedido (requer id)
 * 
 * @param pedidoId - ID do pedido
 * @param item - Dados do item a ser atualizado/adicionado/removido (AtualizarItemGatewayRequest)
 * @param isAdmin - Opcional: força uso de token admin. Se não informado, detecta automaticamente
 * @returns Resposta do gateway com dados do pedido atualizado (AtualizarItemGatewayResponse)
 */
export async function atualizarItemPedidoGateway(
  pedidoId: number,
  item: AtualizarItemGatewayRequest,
  isAdmin?: boolean
): Promise<AtualizarItemGatewayResponse> {
  try {
    const headers: Record<string, string> = {};
    
    // Se isAdmin foi explicitamente informado, usa a lógica específica
    if (isAdmin !== undefined) {
      if (isAdmin) {
        const adminToken = getToken();
        if (!adminToken || !adminToken.trim()) {
          throw new Error("Token de admin não encontrado");
        }
        headers.Authorization = `Bearer ${adminToken}`;
      } else {
        const clientToken = getTokenCliente();
        
        if (!clientToken || !clientToken.trim()) {
          throw new Error("Token de cliente não encontrado");
        }
        headers["X-Super-Token"] = clientToken.trim();
      }
    } else {
      // Detecção automática: prioriza admin, depois client
      const authHeaders = getAuthHeaders();
      Object.assign(headers, authHeaders);
      
      // Garante que pelo menos um token foi fornecido
      if (!headers.Authorization && !headers["X-Super-Token"]) {
        throw new Error("Autenticação necessária. Token de admin ou cliente não encontrado.");
      }
    }
    
    const response = await axios.put<AtualizarItemGatewayResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/itens`,
      item,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao atualizar item do pedido");
  } catch (error: any) {
    // Propaga erros do backend (validações, etc)
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao atualizar item do pedido");
  }
}

/**
 * Atualiza status de um pedido através do Gateway Orquestrador
 * 
 * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/status
 * 
 * O gateway detecta automaticamente se é ADMIN ou CLIENT baseado nos headers de autenticação:
 * - ADMIN: Token Bearer no header `Authorization: Bearer {token}` → pode atualizar status de qualquer pedido
 * - CLIENT: Token no header `X-Super-Token: {token}` → apenas pode atualizar status de seus próprios pedidos
 * 
 * Suporta dois modos de uso:
 * 1. **Atualização simples** (via query parameter):
 *    `PUT /api/gateway/pedidos/{pedido_id}/status?novo_status=CONFIRMADO`
 * 
 * 2. **Atualização com histórico detalhado** (via body):
 *    `PUT /api/gateway/pedidos/{pedido_id}/status`
 *    Body: { "status": "CONFIRMADO", "motivo": "...", "observacoes": "...", "ip_origem": "...", "user_agent": "..." }
 * 
 * @param pedidoId - ID do pedido
 * @param status - Status a ser atualizado (usado em ambos os modos)
 * @param dados - Opcional: dados adicionais para histórico (motivo, observacoes, ip_origem, user_agent)
 * @param isAdmin - Opcional: força uso de token admin. Se não informado, detecta automaticamente
 * @returns Resposta do gateway com dados do pedido atualizado (AtualizarStatusGatewayResponse)
 */
export async function atualizarStatusPedidoGateway(
  pedidoId: number,
  status: string,
  dados?: Omit<AtualizarStatusGatewayRequest, "status">,
  isAdmin?: boolean
): Promise<AtualizarStatusGatewayResponse> {
  try {
    const headers: Record<string, string> = {};
    
    // Se isAdmin foi explicitamente informado, usa a lógica específica
    if (isAdmin !== undefined) {
      if (isAdmin) {
        const adminToken = getToken();
        if (!adminToken || !adminToken.trim()) {
          throw new Error("Token de admin não encontrado");
        }
        headers.Authorization = `Bearer ${adminToken}`;
      } else {
        const clientToken = getTokenCliente();
        
        if (!clientToken || !clientToken.trim()) {
          throw new Error("Token de cliente não encontrado");
        }
        headers["X-Super-Token"] = clientToken.trim();
      }
    } else {
      // Detecção automática: prioriza admin, depois client
      const authHeaders = getAuthHeaders();
      Object.assign(headers, authHeaders);
      
      // Garante que pelo menos um token foi fornecido
      if (!headers.Authorization && !headers["X-Super-Token"]) {
        throw new Error("Autenticação necessária. Token de admin ou cliente não encontrado.");
      }
    }
    
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/status`;
    let body: any = null;
    
    // Se dados adicionais foram fornecidos, usa body com histórico detalhado
    if (dados && Object.keys(dados).length > 0) {
      body = {
        status,
        ...dados,
      };
      headers["Content-Type"] = "application/json";
    } else {
      // Caso contrário, usa query parameter (atualização simples)
      url += `?novo_status=${encodeURIComponent(status)}`;
    }
    
    const response = await axios.put<AtualizarStatusGatewayResponse>(
      url,
      body,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao atualizar status do pedido");
  } catch (error: any) {
    // Propaga erros do backend (validações, etc)
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao atualizar status do pedido");
  }
}

/**
 * Lista pedidos do cliente através do Gateway Orquestrador
 * 
 * Endpoint: GET /api/gateway/pedidos
 * 
 * Retorna lista de pedidos do cliente com dados simplificados incluindo nome do meio de pagamento.
 * 
 * Autenticação: Requer X-Super-Token no header
 * 
 * Query Parameters:
 * - skip: Número de registros para pular (padrão: 0)
 * - limit: Limite de registros (padrão: 50, máximo: 200)
 * 
 * @param skip - Número de registros para pular (padrão: 0)
 * @param limit - Limite de registros (padrão: 50, máximo: 200)
 * @returns Lista de pedidos do cliente (Pedido[])
 */
export async function listarPedidosGateway(
  skip: number = 0,
  limit: number = 50
): Promise<Pedido[]> {
  try {
    // Obtém o token do cliente do clientStore
    const clientToken = getTokenCliente();
    
    if (!clientToken || !clientToken.trim()) {
      throw new Error("Token de cliente não encontrado. Cliente não autenticado.");
    }
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Super-Token": clientToken.trim(), // Envia o token do cliente no header
    };
    
    const response = await axios.get<Pedido[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos?skip=${skip}&limit=${limit}`,
      { headers, maxRedirects: 5 }
    );

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    throw new Error(`Erro ao listar pedidos: Status ${response.status}`);
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao listar pedidos");
  }
}

/**
 * Calcula preview do checkout sem criar o pedido no banco de dados
 * 
 * Endpoint: POST /api/gateway/pedidos/checkout/preview
 * 
 * Calcula e retorna subtotal, taxas, desconto e total sem criar o pedido.
 * Útil para exibir valores ao usuário antes de confirmar o pedido.
 * 
 * Autenticação: Requer X-Super-Token no header
 * 
 * Body: CheckoutGatewayRequest (mesmo schema do checkout, mas apenas DELIVERY suportado)
 * 
 * @param payload - Dados do checkout (mesmo schema do checkout, tipo_pedido deve ser DELIVERY)
 * @returns Preview com valores calculados (subtotal, taxa_entrega, taxa_servico, desconto, valor_total)
 */
export async function previewCheckoutGateway(
  payload: Omit<CheckoutGatewayRequest, "tipo_pedido"> & { tipo_pedido?: "DELIVERY" }
): Promise<{
  subtotal: number;
  taxa_entrega: number;
  taxa_servico: number;
  desconto: number;
  valor_total: number;
}> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    const clientToken = getTokenCliente();
    
    if (!clientToken || !clientToken.trim()) {
      throw new Error("Token de cliente não encontrado. Cliente não autenticado.");
    }
    
    headers["X-Super-Token"] = clientToken.trim();
    
    const response = await axios.post<{
      subtotal: number;
      taxa_entrega: number;
      taxa_servico: number;
      desconto: number;
      valor_total: number;
    }>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/checkout/preview`,
      payload,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao calcular preview do checkout");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao calcular preview do checkout");
  }
}

/**
 * Altera o modo de edição do pedido através do Gateway Orquestrador
 * 
 * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/modo-edicao
 * 
 * Altera o modo de edição do pedido:
 * - True = ativa modo edição (status X - EM_EDICAO)
 * - False = finaliza edição (status D - Editado)
 * 
 * Autenticação: Requer X-Super-Token no header
 * Validação: Valida se o pedido pertence ao cliente
 * 
 * @param pedidoId - ID do pedido
 * @param modoEdicao - true para ativar, false para desativar
 * @returns Resposta do gateway com sucesso/mensagem
 */
export async function alterarModoEdicaoGateway(
  pedidoId: number,
  modoEdicao: boolean
): Promise<{ success: boolean; message: string | null }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    const clientToken = getTokenCliente();
    
    if (!clientToken || !clientToken.trim()) {
      throw new Error("Token de cliente não encontrado. Cliente não autenticado.");
    }
    
    headers["X-Super-Token"] = clientToken.trim();
    
    const response = await axios.put<{ success: boolean; message: string | null }>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/modo-edicao`,
      { modo_edicao: modoEdicao },
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao alterar modo de edição");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao alterar modo de edição");
  }
}

/**
 * Lista pedidos do sistema para visualização no Kanban (admin)
 * 
 * Endpoint: GET /api/gateway/pedidos/kanban
 * 
 * Retorna lista de pedidos do sistema com informações resumidas para visualização no Kanban.
 * 
 * Autenticação: Requer Authorization: Bearer {token} no header
 * 
 * Query Parameters:
 * - empresa_id: ID da empresa (obrigatório)
 * - date_filter: Filtrar pedidos por data (YYYY-MM-DD, opcional)
 * - limit: Limite de registros (padrão: 500, máximo: 1000)
 * 
 * @param empresaId - ID da empresa (obrigatório)
 * @param dateFilter - Filtrar pedidos por data (YYYY-MM-DD, opcional)
 * @param limit - Limite de registros (padrão: 500, máximo: 1000)
 * @returns Lista de pedidos para Kanban
 */
export async function listarPedidosKanbanGateway(
  empresaId: number,
  dateFilter?: string,
  limit: number = 500
): Promise<any[]> {
  try {
    const headers: Record<string, string> = {};
    
    const adminToken = getToken();
    
    if (!adminToken || !adminToken.trim()) {
      throw new Error("Token de admin não encontrado");
    }
    
    headers.Authorization = `Bearer ${adminToken}`;
    
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/kanban?empresa_id=${empresaId}&limit=${limit}`;
    if (dateFilter) {
      url += `&date_filter=${encodeURIComponent(dateFilter)}`;
    }
    
    const response = await axios.get<any[]>(url, { headers });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao listar pedidos do Kanban");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao listar pedidos do Kanban");
  }
}

/**
 * Busca um pedido específico com informações completas (admin)
 * 
 * Endpoint: GET /api/gateway/pedidos/{pedido_id}
 * 
 * Retorna todos os dados do pedido incluindo itens, cliente, endereço, histórico, etc.
 * 
 * Autenticação: Requer Authorization: Bearer {token} no header
 * 
 * @param pedidoId - ID do pedido
 * @returns Pedido completo com todas as informações
 */
export async function buscarPedidoCompletoGateway(
  pedidoId: number
): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    
    const adminToken = getToken();
    
    if (!adminToken || !adminToken.trim()) {
      throw new Error("Token de admin não encontrado");
    }
    
    headers.Authorization = `Bearer ${adminToken}`;
    
    const response = await axios.get<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}`,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao buscar pedido completo");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao buscar pedido completo");
  }
}

/**
 * Obtém o histórico completo de alterações de status de um pedido (admin)
 * 
 * Endpoint: GET /api/gateway/pedidos/{pedido_id}/historico
 * 
 * Retorna o histórico completo de todas as alterações de status do pedido,
 * incluindo motivo, observações, data/hora e responsável pela alteração.
 * 
 * Autenticação: Requer Authorization: Bearer {token} no header
 * 
 * @param pedidoId - ID do pedido
 * @returns Histórico completo de alterações de status do pedido
 */
export async function obterHistoricoPedidoGateway(
  pedidoId: number
): Promise<any[]> {
  try {
    const headers: Record<string, string> = {};
    
    const adminToken = getToken();
    
    if (!adminToken || !adminToken.trim()) {
      throw new Error("Token de admin não encontrado");
    }
    
    headers.Authorization = `Bearer ${adminToken}`;
    
    const response = await axios.get<any[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/historico`,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao obter histórico do pedido");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao obter histórico do pedido");
  }
}

/**
 * Vincula ou desvincula um entregador a um pedido (admin)
 * 
 * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/entregador
 * 
 * Vincula ou desvincula um entregador a um pedido.
 * Para vincular: envie entregador_id com o ID do entregador
 * Para desvincular: envie entregador_id como null ou use o endpoint DELETE
 * 
 * Autenticação: Requer Authorization: Bearer {token} no header
 * 
 * Query Parameters:
 * - entregador_id: ID do entregador para vincular (opcional, omita ou envie null para desvincular)
 * 
 * @param pedidoId - ID do pedido
 * @param entregadorId - ID do entregador para vincular (null ou omitir para desvincular)
 * @returns Resposta do gateway com dados do pedido atualizado
 */
export async function vincularEntregadorGateway(
  pedidoId: number,
  entregadorId?: number | null
): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    
    const adminToken = getToken();
    
    if (!adminToken || !adminToken.trim()) {
      throw new Error("Token de admin não encontrado");
    }
    
    headers.Authorization = `Bearer ${adminToken}`;
    
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/entregador`;
    if (entregadorId !== null && entregadorId !== undefined) {
      url += `?entregador_id=${entregadorId}`;
    }
    
    const response = await axios.put<any>(url, null, { headers });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao vincular entregador");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao vincular entregador");
  }
}

/**
 * Desvincula o entregador atual de um pedido (admin)
 * 
 * Endpoint: DELETE /api/gateway/pedidos/{pedido_id}/entregador
 * 
 * Remove a vinculação do entregador atual com o pedido.
 * 
 * Autenticação: Requer Authorization: Bearer {token} no header
 * 
 * @param pedidoId - ID do pedido
 * @returns Resposta do gateway com dados do pedido atualizado
 */
export async function desvincularEntregadorGateway(
  pedidoId: number
): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    
    const adminToken = getToken();
    
    if (!adminToken || !adminToken.trim()) {
      throw new Error("Token de admin não encontrado");
    }
    
    headers.Authorization = `Bearer ${adminToken}`;
    
    const response = await axios.delete<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gateway/pedidos/${pedidoId}/entregador`,
      { headers }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Erro ao desvincular entregador");
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    
    throw new Error(error.message || "Erro inesperado ao desvincular entregador");
  }
}

