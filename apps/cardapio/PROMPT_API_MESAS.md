# Prompt para Implementação da API de Mesas - Endpoint Cliente

## Contexto

Precisamos criar endpoints de **cliente** para o sistema de mesas, permitindo que clientes possam criar pedidos de mesa/balcão diretamente. Atualmente existe apenas endpoints admin em `/api/mesas/admin/`.

---

## Requisitos

### 1. Novo Endpoint para Cliente

**Endpoint:** `POST /api/mesas/client/pedidos`

**Autenticação:** Requer token de cliente no header (`x-super-token`)

**Base URL:** `https://teste2.mensuraapi.com.br`

---

## Funcionalidades a Implementar

### 1. Recebimento do `mesa_id` do Frontend

**IMPORTANTE:** O frontend já recebe `?mesa=X` da URL e converte para `mesa_id` no body da requisição.

O endpoint deve receber `mesa_id` no body do request:

```
POST /api/mesas/client/pedidos
```

**Comportamento:**
- Se `mesa_id` for um número no body, o sistema deve:
  1. Validar se a mesa existe
  2. Verificar se a mesa está disponível (status `"D"` - Disponível)
  3. Se disponível, ocupar automaticamente ao confirmar o pedido
  4. Se não disponível, retornar erro claro
- Se `mesa_id` for `null` ou não informado → é pedido de balcão (não validar nem ocupar mesa)

---

## Request Body - PedidoMesaClientRequest

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `itens` | `PedidoMesaItemIn[]` | Lista de itens do pedido (mínimo 1) |

### Campos Opcionais

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `mesa_id` | `int \| null` | `null` | **Obrigatório se query `?mesa=X` for informado** - ID da mesa (se não vier na query, usar do body) |
| `cliente_id` | `int \| null` | `null` | **Ignorado** - Cliente é identificado pelo token |
| `observacoes` | `string \| null` | `null` | Observações gerais do pedido (máx 500 caracteres) |
| `num_pessoas` | `int \| null` | `null` | Número de pessoas na mesa (opcional, min: 1, max: 50) |

### Schema de Entrada

```typescript
interface PedidoMesaClientRequest {
  mesa_id?: number | null;           // Obrigatório se ?mesa=X na URL
  cliente_id?: number | null;        // Ignorado - vem do token
  observacoes?: string | null;       // Máx 500 caracteres
  num_pessoas?: number | null;       // Opcional, 1-50
  itens: PedidoMesaItemIn[];         // Obrigatório, mínimo 1
}

interface PedidoMesaItemIn {
  produto_cod_barras: string;        // Obrigatório - minLength: 1
  quantidade: number;                 // Obrigatório - min: 1, default: 1
  observacao?: string | null;        // Opcional - máx 255 caracteres
}
```

---

## Regras de Negócio e Validações

### 1. Recebimento do `mesa_id` do Body

```python
# Pseudocódigo
mesa_id = request.body.get("mesa_id")  # Vem do frontend

# Se mesa_id for None/null, é balcão (não validar)
if mesa_id is None:
    # É pedido de balcão - criar sem validar mesa
    criar_pedido_balcao(...)
else:
    # É pedido de mesa - validar e ocupar
    validar_e_ocupar_mesa(mesa_id)
    criar_pedido_mesa(...)
```

### 2. Validação e Ocupação da Mesa

**Quando `mesa_id` for informado (query ou body):**

1. **Validar existência:**
   ```python
   mesa = await get_mesa_by_id(mesa_id)
   if not mesa:
       raise NotFoundError(f"Mesa {mesa_id} não encontrada")
   ```

2. **Validar status:**
   ```python
   if mesa.status != "D":  # D = Disponível
       raise ValidationError({
           "detail": {
               "message": f"Mesa {mesa.numero} não está disponível",
               "mesa_id": mesa_id,
               "status_atual": mesa.status,
               "status_descricao": mesa.status_descricao,
               "motivo": get_motivo_indisponibilidade(mesa.status)
           }
       })
   ```

3. **Validar se está ativa:**
   ```python
   if mesa.ativa != "S":
       raise ValidationError({
           "detail": {
               "message": f"Mesa {mesa.numero} está inativa",
               "mesa_id": mesa_id
           }
       })
   ```

4. **Validar se não tem pedidos abertos:**
   ```python
   pedidos_abertos = await get_pedidos_abertos_mesa(mesa_id)
   if pedidos_abertos:
       raise ValidationError({
           "detail": {
               "message": f"Mesa {mesa.numero} já possui pedido(s) aberto(s)",
               "mesa_id": mesa_id,
               "pedidos_abertos": [p.id for p in pedidos_abertos]
           }
       })
   ```

5. **Ocupar a mesa ANTES de criar o pedido (transação atômica):**
   ```python
   async with db.transaction():
       # 1. Ocupar mesa primeiro (para evitar race condition)
       await ocupar_mesa(mesa_id)
       
       # 2. Criar pedido
       pedido = await criar_pedido_mesa(...)
       
       # 3. Se criar pedido falhar, reverter ocupação
       # (transação já faz isso automaticamente)
   ```

### 3. Validação de Itens

- **Mínimo:** 1 item
- **Máximo:** 200 itens (se necessário, ajuste conforme regra de negócio)
- Produto deve existir e estar disponível/ativo
- Validar `produto_cod_barras` não pode ser vazio

### 4. Validação de Cliente

- Cliente é identificado automaticamente pelo token (`x-super-token`)
- Se cliente não existir ou token inválido, retornar `401 Unauthorized`

### 5. Validação de Balcão (mesa_id null)

```python
# Se mesa_id for null, é balcão - aceitar normalmente
if mesa_id is None:
    # Pedido de balcão - não validar nem ocupar mesa
    criar_pedido_balcao(...)
else:
    # Pedido de mesa - validar e ocupar
    validar_e_ocupar_mesa(mesa_id)
    criar_pedido_mesa(...)
```

### 6. Tratamento de Concorrência

**Problema:** Dois clientes tentam ocupar a mesma mesa simultaneamente

**Solução:**
```python
# Usar lock otimista ou transação com nível de isolamento adequado
async with db.transaction(isolation_level="SERIALIZABLE"):
    # Verificar status novamente dentro da transação
    mesa_atual = await get_mesa_by_id_lock(mesa_id, for_update=True)
    
    if mesa_atual.status != "D":
        raise ValidationError("Mesa foi ocupada por outro cliente")
    
    await ocupar_mesa(mesa_id)
    pedido = await criar_pedido_mesa(...)
```

---

## Response - PedidoMesaClientResponse

### Status Code de Sucesso: `201 CREATED`

### Schema de Resposta

```typescript
interface PedidoMesaClientResponse {
  id: number;
  numero_pedido: string;
  mesa_id: number | null;                    // null se for balcão
  cliente_id: number | null;
  num_pessoas: number | null;
  status: "P" | "C" | "R" | "T" | "E" | "X"; // Status do pedido mesa
  status_descricao: string;
  observacoes: string | null;
  valor_total: number;
  itens: PedidoMesaItemOut[];
  mesa?: MesaResumoOut | null;               // Informações da mesa (se aplicável)
}

interface PedidoMesaItemOut {
  id: number;
  produto_cod_barras: string;
  quantidade: number;
  preco_unitario: number;
  observacao: string | null;
  produto_descricao_snapshot: string | null;
  produto_imagem_snapshot: string | null;
}

interface MesaResumoOut {
  id: number;
  numero: string;
  descricao: string | null;
  capacidade: number;
  status: "D" | "O" | "R";
  status_descricao: string;
}
```

---

## Exemplos de Request

### Exemplo 1: Pedido de Mesa (Frontend envia mesa_id no body)

**Request:**
```
POST /api/mesas/client/pedidos
Content-Type: application/json
x-super-token: abc123...

{
  "mesa_id": 5,
  "num_pessoas": 4,
  "observacoes": "Sem cebola no hambúrguer",
  "itens": [
    {
      "produto_cod_barras": "7891234567890",
      "quantidade": 2,
      "observacao": "Bem passado"
    },
    {
      "produto_cod_barras": "7891234567891",
      "quantidade": 1
    }
  ]
}
```

**Nota:** O frontend recebe `?mesa=5` da URL e converte para `mesa_id: 5` no body antes de enviar.

**Response (201):**
```json
{
  "id": 123,
  "numero_pedido": "MESA-2024-00123",
  "mesa_id": 5,
  "cliente_id": 42,
  "num_pessoas": 4,
  "status": "P",
  "status_descricao": "Pendente",
  "observacoes": "Sem cebola no hambúrguer",
  "valor_total": 85.50,
  "itens": [
    {
      "id": 1,
      "produto_cod_barras": "7891234567890",
      "quantidade": 2,
      "preco_unitario": 25.00,
      "observacao": "Bem passado",
      "produto_descricao_snapshot": "Hambúrguer Artesanal",
      "produto_imagem_snapshot": "https://..."
    },
    {
      "id": 2,
      "produto_cod_barras": "7891234567891",
      "quantidade": 1,
      "preco_unitario": 35.50,
      "observacao": null,
      "produto_descricao_snapshot": "Pizza Margherita",
      "produto_imagem_snapshot": "https://..."
    }
  ],
  "mesa": {
    "id": 5,
    "numero": "5",
    "descricao": "Mesa de frente para a janela",
    "capacidade": 6,
    "status": "O",
    "status_descricao": "Ocupada"
  }
}
```

### Exemplo 2: Pedido de Balcão (sem mesa)

**Request:**
```
POST /api/mesas/client/pedidos
Content-Type: application/json
x-super-token: abc123...

{
  "observacoes": "Retirada rápida",
  "itens": [
    {
      "produto_cod_barras": "7891234567890",
      "quantidade": 1
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 124,
  "numero_pedido": "BALCAO-2024-00124",
  "mesa_id": null,
  "cliente_id": 42,
  "num_pessoas": null,
  "status": "P",
  "status_descricao": "Pendente",
  "observacoes": "Retirada rápida",
  "valor_total": 25.00,
  "itens": [...],
  "mesa": null
}
```

### Exemplo 3: Pedido de Mesa (mesa_id sempre no body)

**Request:**
```
POST /api/mesas/client/pedidos
Content-Type: application/json
x-super-token: abc123...

{
  "mesa_id": 3,
  "itens": [...]
}
```

**Nota:** O frontend sempre envia `mesa_id` no body, não na query string.

---

## Tratamento de Erros

### 400 Bad Request

```json
// Mesa não disponível
{
  "detail": {
    "message": "Mesa 5 não está disponível",
    "mesa_id": 5,
    "status_atual": "O",
    "status_descricao": "Ocupada",
    "motivo": "Mesa já está ocupada por outro pedido"
  }
}

// Mesa não encontrada
{
  "detail": {
    "message": "Mesa 999 não encontrada",
    "mesa_id": 999
  }
}

// Mesa inativa
{
  "detail": {
    "message": "Mesa 5 está inativa",
    "mesa_id": 5
  }
}

// Mesa já possui pedido aberto
{
  "detail": {
    "message": "Mesa 5 já possui pedido(s) aberto(s)",
    "mesa_id": 5,
    "pedidos_abertos": [120, 121]
  }
}

// Pedido vazio
{
  "detail": "Pedido deve conter pelo menos 1 item"
}

// Produto não encontrado
{
  "detail": "Produto 7891234567890 não encontrado"
}

// Mesa obrigatória
{
  "detail": {
    "message": "Mesa é obrigatória para pedidos de mesa",
    "mesa_obrigatoria": true
  }
}
```

### 401 Unauthorized

```json
{
  "detail": "Token de autenticação inválido ou expirado"
}
```

### 404 Not Found

```json
{
  "detail": "Cliente não encontrado"
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

### 422 Unprocessable Entity (Validação)

```json
{
  "detail": [
    {
      "loc": ["body", "itens"],
      "msg": "Lista de itens não pode estar vazia",
      "type": "value_error"
    },
    {
      "loc": ["body", "num_pessoas"],
      "msg": "Número de pessoas deve estar entre 1 e 50",
      "type": "value_error"
    }
  ]
}
```

---

## Integridade de Dados

### 1. Transações Atômicas

```python
# Pseudocódigo
async def criar_pedido_mesa_cliente(request):
    async with db.transaction():
        # 1. Validar mesa
        mesa = await validar_mesa(request.mesa_id)
        
        # 2. Ocupar mesa
        await ocupar_mesa(mesa.id)
        
        try:
            # 3. Criar pedido
            pedido = await criar_pedido(...)
            
            # 4. Criar itens
            itens = await criar_itens_pedido(pedido.id, request.itens)
            
            return pedido
            
        except Exception as e:
            # Se falhar, liberar mesa
            await liberar_mesa(mesa.id)
            raise
```

### 2. Rollback em Caso de Erro

Se qualquer etapa falhar após ocupar a mesa, a mesa deve ser liberada automaticamente.

### 3. Histórico de Mesa

Registrar no histórico da mesa:
- Tipo de operação: `PEDIDO_CRIADO`
- Cliente associado
- Observações

---

## Checklist de Implementação

- [ ] Criar endpoint `POST /api/mesas/client/pedidos`
- [ ] Receber `mesa_id` do body do request (frontend já envia)
- [ ] Implementar validação de mesa (existência, status, ativa) - apenas se `mesa_id` não for null
- [ ] Implementar ocupação automática da mesa ao confirmar pedido
- [ ] Implementar transação atômica (ocupar → criar pedido)
- [ ] Implementar rollback em caso de erro
- [ ] Validar itens (mínimo 1, produtos existentes)
- [ ] Registrar histórico da mesa
- [ ] Tratar concorrência (lock otimista/pessimista)
- [ ] Retornar erros claros e estruturados
- [ ] Testar cenários:
  - [ ] Mesa disponível
  - [ ] Mesa ocupada
  - [ ] Mesa inativa
  - [ ] Mesa não encontrada
  - [ ] Pedido sem mesa (balcão)
  - [ ] Concorrência (2 clientes simultâneos)
  - [ ] Erro ao criar pedido (libera mesa)

---

## Notas Importantes

1. **Frontend envia `mesa_id`:** O frontend recebe `?mesa=X` da URL e converte para `mesa_id` no body
2. **Ocupação:** Mesa deve ser ocupada **antes** de criar o pedido para evitar race conditions
3. **Integridade:** Usar transações de banco de dados para garantir atomicidade
4. **Cliente:** Sempre identificar cliente pelo token, ignorar `cliente_id` do body
5. **Balcão:** Para pedidos de balcão, frontend envia `mesa_id: null` (API aceita sem validar)
6. **Status Inicial:** Pedido de mesa inicia com status `"P"` (Pendente)
7. **Número do Pedido:** Gerar número único (ex: `MESA-2024-00123` ou `BALCAO-2024-00124`)

