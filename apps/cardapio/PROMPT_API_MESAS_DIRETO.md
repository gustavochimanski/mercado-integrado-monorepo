# Prompt Direto para API - Endpoint Cliente de Mesas

## Objetivo

Criar endpoint **client** para criação de pedidos de mesa/balcão com suporte a parâmetro `?mesa=X` na URL que ocupa automaticamente a mesa ao confirmar o pedido.

---

## Endpoint a Criar

```
POST /api/mesas/client/pedidos?mesa=1
```

**Autenticação:** Header `x-super-token` (token do cliente)

---

## Requisitos Técnicos

### 1. Recebimento do `mesa_id`

**O frontend já está enviando `mesa_id` no body da requisição.** A API deve:

- Aceitar `mesa_id` no body do request
- Se `mesa_id` for informado → validar e ocupar a mesa
- Se `mesa_id` for `null` ou não informado → é pedido de balcão (aceitar normalmente)

### 2. Ocupação Automática da Mesa

**ANTES de criar o pedido:**
1. Validar se mesa existe
2. Validar se mesa está disponível (status = `"D"`)
3. Validar se mesa está ativa (`ativa = "S"`)
4. Validar se não tem pedidos abertos
5. **Ocupar a mesa** (status → `"O"`)
6. Criar o pedido
7. Se criar pedido falhar → **liberar a mesa**

**TUDO em uma transação atômica:**
```python
async with db.transaction():
    mesa = await validar_e_ocupar_mesa(mesa_id)  # Ocupa aqui
    pedido = await criar_pedido_mesa(...)        # Se falhar, rollback libera mesa
```

### 3. Request Body

**O frontend envia:**

```typescript
{
  mesa_id: number | null;         // Vem do frontend (pode vir de ?mesa=X na URL ou seleção manual)
  cliente_id?: number | null;     // Opcional, cliente vem do token
  observacoes?: string | null;    // Máx 500 chars
  num_pessoas?: number | null;    // Opcional, 1-50
  itens: Array<{
    produto_cod_barras: string;   // Obrigatório
    quantidade: number;            // Min: 1
    observacao?: string | null;   // Máx 255 chars
  }>;
}
```

**Obrigatório:** `itens` (mínimo 1 item)

**Comportamento:**
- Se `mesa_id` for `number` → validar e ocupar mesa
- Se `mesa_id` for `null` ou não enviado → é balcão (não ocupar mesa)

### 4. Validações Obrigatórias

#### Mesa (se `mesa_id` for informado):
- ✅ Mesa existe?
- ✅ Status = `"D"` (Disponível)?
- ✅ `ativa = "S"`?
- ✅ Não tem pedidos abertos?
- ✅ Se `mesa_id` for `null` ou não enviado → é balcão (pular validações de mesa)

#### Itens:
- ✅ Mínimo 1 item
- ✅ Produto existe e está disponível
- ✅ `produto_cod_barras` não vazio
- ✅ `quantidade >= 1`

#### Cliente:
- ✅ Identificado pelo token (ignorar `cliente_id` do body)

### 5. Tratamento de Concorrência

**Problema:** 2 clientes tentam ocupar mesma mesa simultaneamente

**Solução:**
- Usar lock na mesa dentro da transação
- Se tentar ocupar mesa já ocupada → erro 409 Conflict

### 6. Response (201 CREATED)

```typescript
{
  id: number;
  numero_pedido: string;           // Ex: "MESA-2024-00123"
  mesa_id: number | null;         // null se balcão
  cliente_id: number | null;
  num_pessoas: number | null;
  status: "P";                     // Sempre inicia Pendente
  status_descricao: string;
  observacoes: string | null;
  valor_total: number;
  itens: Array<{
    id: number;
    produto_cod_barras: string;
    quantidade: number;
    preco_unitario: number;
    observacao: string | null;
    produto_descricao_snapshot: string | null;
    produto_imagem_snapshot: string | null;
  }>;
  mesa?: {                          // Info da mesa (se aplicável)
    id: number;
    numero: string;
    status: "O";                    // Agora ocupada
    status_descricao: string;
  } | null;
}
```

---

## Erros Esperados

### 400 Bad Request

```json
// Mesa não disponível
{
  "detail": {
    "message": "Mesa 5 não está disponível",
    "mesa_id": 5,
    "status_atual": "O",
    "status_descricao": "Ocupada",
    "motivo": "Mesa já está ocupada"
  }
}

// Mesa não encontrada
{
  "detail": {
    "message": "Mesa 999 não encontrada",
    "mesa_id": 999
  }
}

// Pedido vazio
{
  "detail": "Pedido deve conter pelo menos 1 item"
}
```

### 409 Conflict (Concorrência)

```json
{
  "detail": {
    "message": "Mesa foi ocupada por outro cliente. Tente novamente.",
    "mesa_id": 5,
    "code": "CONCURRENT_UPDATE"
  }
}
```

### 422 Unprocessable Entity

```json
{
  "detail": [
    {
      "loc": ["body", "itens"],
      "msg": "Lista de itens não pode estar vazia",
      "type": "value_error"
    }
  ]
}
```

---

## Exemplo de Uso

### Request (Frontend envia mesa_id no body):
```
POST /api/mesas/client/pedidos
x-super-token: abc123...

{
  "mesa_id": 5,
  "num_pessoas": 4,
  "observacoes": "Sem cebola",
  "itens": [
    {
      "produto_cod_barras": "7891234567890",
      "quantidade": 2
    }
  ]
}
```

**Nota:** O frontend recebe `?mesa=5` da URL e converte para `mesa_id: 5` no body antes de enviar.

### Response:
```json
{
  "id": 123,
  "numero_pedido": "MESA-2024-00123",
  "mesa_id": 5,
  "status": "P",
  "valor_total": 50.00,
  "mesa": {
    "id": 5,
    "numero": "5",
    "status": "O",
    "status_descricao": "Ocupada"
  },
  ...
}
```

---

## Checklist Crítico

- [ ] **Transação atômica:** Ocupar mesa e criar pedido na mesma transação
- [ ] **Rollback:** Se criar pedido falhar, liberar mesa automaticamente
- [ ] **Validação de concorrência:** Lock na mesa para evitar race condition
- [ ] **Receber mesa_id do body:** Frontend envia `mesa_id` no request body
- [ ] **Validação condicional:** Só validar/ocupar mesa se `mesa_id` não for `null`
- [ ] **Histórico:** Registrar `PEDIDO_CRIADO` no histórico da mesa (se aplicável)
- [ ] **Cliente:** Identificar pelo token, ignorar `cliente_id` do body
- [ ] **Balcão:** Aceitar pedido com `mesa_id = null` (não validar nem ocupar mesa)

---

## Observações Importantes

1. **Frontend já envia `mesa_id`:** O frontend recebe `?mesa=X` da URL e converte para `mesa_id` no body
2. **Mesa é ocupada ANTES de criar pedido** - isso evita race conditions
3. **Tudo em uma transação** - se falhar qualquer coisa, rollback libera mesa
4. **Lock na mesa** - evitar que 2 clientes ocupem simultaneamente
5. **Para balcão:** Frontend envia `mesa_id: null` → API aceita sem validar mesa
6. **Cliente vem do token:** Nunca confiar no `cliente_id` do body

