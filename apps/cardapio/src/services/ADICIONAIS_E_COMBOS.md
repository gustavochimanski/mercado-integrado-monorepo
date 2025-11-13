# Guia de Implementação: Adicionais e Combos

Este documento descreve como usar os serviços e hooks implementados para trabalhar com **Adicionais** e **Combos** no frontend.

## 📋 Visão Geral

- **Adicionais**: Opções extras por produto (molhos, tamanhos, etc.)
- **Combos**: Pacotes com vários produtos por um preço total
- **Receitas (Ingredientes)**: Composições internas do produto (uso administrativo)

## 🔧 Serviços Implementados

### 1. Adicionais - Cliente

#### Hook: `useAdicionaisProduto`

Busca os adicionais disponíveis para um produto específico.

```tsx
import { useAdicionaisProduto } from "@cardapio/services/adicionais/useQueryAdicionais";

function ProductCustomization({ codBarras }: { codBarras: string }) {
  const { data: adicionais, isLoading } = useAdicionaisProduto(codBarras);

  if (isLoading) return <div>Carregando adicionais...</div>;
  if (!adicionais || adicionais.length === 0) {
    return <div>Nenhum adicional disponível</div>;
  }

  return (
    <div>
      <h3>Personalize seu pedido:</h3>
      {adicionais.map((adicional) => (
        <label key={adicional.id}>
          <input
            type="checkbox"
            value={adicional.id}
            // ... lógica de seleção
          />
          {adicional.nome} - R$ {adicional.preco.toFixed(2)}
        </label>
      ))}
    </div>
  );
}
```

#### Função Síncrona: `buscarAdicionaisProduto`

Para uso em funções que não são componentes React:

```tsx
import { buscarAdicionaisProduto } from "@cardapio/services/adicionais/useQueryAdicionais";

async function loadProductAddons(codBarras: string) {
  try {
    const adicionais = await buscarAdicionaisProduto(codBarras);
    return adicionais;
  } catch (error) {
    console.error("Erro ao buscar adicionais:", error);
    return [];
  }
}
```

### 2. Combos - Cliente

#### Hook: `useCombosCliente`

**NOTA**: Este endpoint ainda não existe no backend. O hook está preparado para quando o endpoint `/api/cadastros/client/combos` for implementado.

```tsx
import { useCombosCliente } from "@cardapio/services/combos/useQueryCombos";

function CombosSection({ empresaId }: { empresaId: number }) {
  const { data: combos, isLoading } = useCombosCliente(empresaId);

  if (isLoading) return <div>Carregando combos...</div>;
  if (!combos || combos.length === 0) {
    return <div>Nenhum combo disponível</div>;
  }

  return (
    <div>
      <h2>Combos Disponíveis</h2>
      {combos.map((combo) => (
        <div key={combo.id}>
          <h3>{combo.titulo}</h3>
          <p>R$ {combo.preco_total.toFixed(2)}</p>
          {/* ... UI do combo */}
        </div>
      ))}
    </div>
  );
}
```

## 🛒 Carrinho (Cart Store)

O carrinho foi atualizado para suportar adicionais e combos:

### Tipos

```tsx
interface CartItem {
  cod_barras: string;
  nome: string;
  preco: number;
  quantity: number;
  empresaId: number;
  imagem?: string | null;
  categoriaId?: number;
  subcategoriaId?: number;
  observacao?: string;
  adicionais_ids?: number[]; // ✅ NOVO: IDs dos adicionais selecionados
}

interface CartCombo {
  combo_id: number;
  quantidade: number;
}
```

### Métodos Disponíveis

```tsx
const {
  items,              // Array de CartItem
  combos,             // ✅ NOVO: Array de CartCombo
  add,                // Adicionar item ao carrinho
  addCombo,           // ✅ NOVO: Adicionar combo ao carrinho
  removeCombo,        // ✅ NOVO: Remover combo do carrinho
  updateAdicionaisItem, // ✅ NOVO: Atualizar adicionais de um item
  // ... outros métodos
} = useCart();
```

### Exemplo de Uso

```tsx
import { useCart } from "@cardapio/stores/cart/useCart";

function ProductSheet({ produto }: { produto: ProdutoEmpMini }) {
  const { add, updateAdicionaisItem } = useCart();
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<number[]>([]);

  const handleAddToCart = () => {
    // Adicionar produto com adicionais
    add({
      cod_barras: produto.cod_barras,
      nome: produto.produto.descricao,
      preco: produto.preco_venda,
      quantity: 1,
      empresaId: produto.empresa,
      adicionais_ids: adicionaisSelecionados, // ✅ Incluir adicionais
    });
  };

  return (
    <div>
      {/* UI de seleção de adicionais */}
      <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
    </div>
  );
}
```

## ✅ Checkout

Os serviços de checkout já foram atualizados para incluir adicionais e combos automaticamente:

### Preview Checkout

O hook `usePreviewCheckout` já inclui adicionais e combos do carrinho:

```tsx
import { usePreviewCheckout } from "@cardapio/services/pedidos/usePreviewCheckout";

function CheckoutPreview() {
  const { data: preview } = usePreviewCheckout({
    tipoPedido: "DELIVERY",
    enderecoId: 123,
    meioPagamentoId: 1,
  });

  // O preview já inclui:
  // - Adicionais dos itens (via adicionais_ids)
  // - Combos do carrinho
  // - Cálculo correto de subtotal, taxas e total

  return (
    <div>
      <p>Subtotal: R$ {preview?.subtotal.toFixed(2)}</p>
      <p>Taxa de Entrega: R$ {preview?.taxa_entrega.toFixed(2)}</p>
      <p>Total: R$ {preview?.valor_total.toFixed(2)}</p>
    </div>
  );
}
```

### Finalizar Checkout

O serviço `finalizarCheckoutCliente` também já inclui adicionais e combos:

```tsx
import { finalizarCheckoutCliente } from "@cardapio/services/pedidos/checkout-finalizar-pedido";

// O payload já inclui automaticamente:
// - adicionais_ids de cada item
// - combos do carrinho
await finalizarCheckoutCliente(payload);
```

## 📝 Tipos Atualizados

### `ItemPedidoRequest`

```tsx
interface ItemPedidoRequest {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
  adicionais_ids?: number[]; // ✅ NOVO
}
```

### `FinalizarPedidoRequest`

```tsx
interface FinalizarPedidoRequest {
  // ... campos existentes
  itens: ItemPedidoRequest[];
  combos?: ComboPedidoRequest[]; // ✅ NOVO
}

interface ComboPedidoRequest {
  combo_id: number;
  quantidade?: number; // Default: 1
}
```

## 🔗 Endpoints Utilizados

### Adicionais

- **GET** `/api/cadastros/client/adicionais/produto/{cod_barras}`
  - Header: `X-Super-Token: <token>`
  - Query: `apenas_ativos=true|false` (default: true)

### Checkout

- **POST** `/api/cardapio/client/pedidos/checkout/preview`
- **POST** `/api/cardapio/client/pedidos/checkout`

Ambos aceitam:
- `itens` com `adicionais_ids` opcional
- `combos` opcional

### Combos (Futuro)

- **GET** `/api/cadastros/client/combos` (ainda não implementado)

## 🎯 Próximos Passos

1. **Implementar UI de seleção de adicionais** nos componentes de produto
2. **Implementar UI de combos** quando o endpoint estiver disponível
3. **Atualizar componentes de carrinho** para exibir adicionais selecionados
4. **Atualizar componentes de checkout** para exibir combos

## 📚 Referências

- Guia completo do backend: Ver documentação fornecida sobre Receitas, Adicionais e Combos
- Tipos: `src/types/pedido.ts`
- Serviços: `src/services/adicionais/` e `src/services/combos/`
- Store: `src/stores/cart/useCart.ts`

