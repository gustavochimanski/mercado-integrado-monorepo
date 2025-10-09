# Midas Supervisor

Sistema administrativo para gestão empresarial de delivery, vendas e estoque.

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

### Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# API URL
# Configurações da API Principal (Mensura)
NEXT_PUBLIC_API_URL=https://teste2.mensuraapi.com.br

# URL da documentação da API para geração do client TypeScript
API_DOC_URL=https://teste2.mensuraapi.com.br/openapi.json

# Ambiente de desenvolvimento
NODE_ENV=development

```

### Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 🔐 Autenticação

O sistema possui:
- Login com usuário e senha
- Sistema de LockScreen por inatividade (20 minutos)
- Proteção de rotas com middleware
- Limite de 3 tentativas de login no LockScreen

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

## 📄 Licença

Projeto proprietário - Todos os direitos reservados @2025 UNITEC - GESTÃO E TECNOLOGIA.
