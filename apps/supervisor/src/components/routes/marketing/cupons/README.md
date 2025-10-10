# Sistema de Cupons com QR Code Automático

## Visão Geral

O sistema de cupons foi atualizado para gerar automaticamente links do cardápio com o código do cupom como parâmetro e renderizar QR codes correspondentes. O QR code e link são exibidos no modal de edição do cupom.

## Como Funciona

1. **Geração Automática de Link**: Cada cupom gera automaticamente um link no formato:
   ```
   CARDAPIO_LINK/?cupom=CODIGO_DO_CUPOM
   ```

2. **QR Code Dinâmico**: O QR code é gerado automaticamente baseado no código do cupom e no link do cardápio da empresa.

3. **Link da Empresa**: O `cardapio_link` vem da API através do campo `cardapio_link` da empresa.

4. **Exibição no Modal**: O QR code e link são mostrados no modal de edição do cupom, não na tabela.

## Componentes

### QRCodeGenerator
```tsx
import QRCodeGenerator from "@supervisor/components/shared/QRCodeGenerator";

// Uso básico (usa URL padrão)
<QRCodeGenerator cupom={{ codigo: "DESCONTO10" }} />

// Com cardapio_link da empresa
<QRCodeGenerator 
  cupom={{ codigo: "DESCONTO10" }} 
  cardapioLink="https://cardapio.empresa.com.br" 
/>
```

### TableCupons
```tsx
import TableCupons from "./TableCupons";

// Tabela simples sem QR code (QR code está no modal de edição)
<TableCupons />
```

### EditarCupomModal
```tsx
import EditarCupomModal from "./EditarCupomModal";

// Modal que exibe o QR code e link do cupom
<EditarCupomModal 
  open={isOpen} 
  onOpenChange={setIsOpen}
  cupom={cupomSelecionado}
  onSaved={refetch}
/>
```

## Função Utilitária

### generateCupomLink
```tsx
import { generateCupomLink } from "@supervisor/services/useQueryCupons";

// Gera link com URL padrão
const link = generateCupomLink("DESCONTO10");
// Retorna: "https://cardapio.mensura.com.br/?cupom=DESCONTO10"

// Gera link com cardapio_link da empresa
const link = generateCupomLink("DESCONTO10", "https://cardapio.empresa.com.br");
// Retorna: "https://cardapio.empresa.com.br/?cupom=DESCONTO10"
```

## Configuração

### Variável de Ambiente
```env
NEXT_PUBLIC_CARDAPIO_URL=https://cardapio.mensura.com.br
```

### Fallback
Se não houver `cardapio_link` da empresa ou variável de ambiente, o sistema usa a URL padrão: `https://cardapio.mensura.com.br`

## Exemplo de Integração Completa

```tsx
import TableCupons from "./TableCupons";
import EditarCupomModal from "./EditarCupomModal";

function CuponsPage() {
  const [selectedCupom, setSelectedCupom] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div>
      <h1>Cupons</h1>
      <TableCupons />
      
      {selectedCupom && (
        <EditarCupomModal 
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          cupom={selectedCupom}
          onSaved={() => refetch()}
        />
      )}
    </div>
  );
}
```

## Funcionalidades do Modal de Edição

- **QR Code**: Gerado automaticamente baseado no código do cupom
- **Link Copiável**: Botão para copiar o link do cupom
- **Feedback Visual**: Toast de confirmação ao copiar
- **Informações**: Instruções sobre como usar o QR code
- **Responsivo**: Layout adaptado para diferentes tamanhos de tela

## Benefícios

1. **Automatização**: Não é mais necessário inserir links manualmente
2. **Consistência**: Todos os links seguem o mesmo padrão
3. **Flexibilidade**: Suporte a diferentes URLs de cardápio por empresa
4. **QR Code**: Geração automática de QR codes para fácil compartilhamento
5. **Fallback**: Sistema robusto com URLs padrão quando necessário
6. **UX Melhorada**: QR code e link no modal de edição para melhor organização
