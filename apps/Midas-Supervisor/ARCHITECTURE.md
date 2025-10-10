# 🏗️ Arquitetura do Projeto Midas-Supervisor

> **Guia de decisões arquiteturais e padrões adotados no projeto**

## 🎯 Visão Geral

Este projeto utiliza **Next.js 15** com **App Router** e segue uma arquitetura **Server-First**, priorizando:

- ✅ Server Components por padrão
- ✅ Client Components apenas quando necessário
- ✅ Server Actions para mutations
- ✅ Organização clara de componentes
- ✅ TypeScript 100%

---

## 📁 Organização de Componentes

### 🎯 3 Regras de Organização

Seguimos um padrão claro de organização baseado em **escopo e reutilização**:

#### 1. **`app/[rota]/_components/`** - Componentes Privados

**Quando usar:**
- Componente usado **APENAS** naquela página/rota específica
- Não será reutilizado em outros lugares
- Implementação específica do layout da página

---

**Por que funciona:**
- ✅ Isolamento: mudanças não afetam outras páginas
- ✅ Code splitting: Next.js carrega apenas quando necessário
- ✅ Refatoração segura: pode deletar/modificar sem medo
- ✅ Clareza: nome com `_` indica "privado"

---

**Por que funciona:**
- ✅ DRY (Don't Repeat Yourself): código em um só lugar
- ✅ Consistência: mesmo componente em todas as páginas
- ✅ Manutenção: atualiza em um lugar, reflete em todos
- ✅ Organização por domínio: fácil encontrar componentes relacionados

---

**Por que funciona:**
- ✅ Reusabilidade máxima: serve para qualquer contexto
- ✅ Centralização: componentes core do design system
- ✅ Testabilidade: componentes isolados de regras de negócio
- ✅ Flexibilidade: aceita props genéricas

---

**Perguntas para decidir:**

1. **Só vou usar nesta página?** → `_components/`
2. **Vou usar em várias páginas de pedidos?** → `components/pedidos/`
3. **Posso usar em qualquer domínio?** → `components/shared/`

---

## ⚡ Server Components vs Client Components

### 🎯 Regra de Ouro: Server-First

> **Server Components por padrão. Client Components apenas quando necessário.**

---

### 🖥️ Server Components (Padrão)

**O que são:**
- Componentes que renderizam **no servidor**
- Não enviam JavaScript para o cliente
- Podem acessar dados diretamente (banco, APIs, arquivos)

**Quando usar:**
- ✅ **95% dos casos** (padrão do Next.js 15)
- ✅ Buscar dados de APIs/banco
- ✅ Páginas, layouts, templates
- ✅ Componentes estáticos

**Benefícios:**
- 🚀 Performance: menos JavaScript baixado
- 🔒 Segurança: dados sensíveis no servidor
- 📈 SEO: conteúdo já renderizado
- 💰 Custo menor: processamento no servidor

---

### 🎨 Client Components (Quando necessário)

**O que são:**
- Componentes com `'use client'` no topo
- Rodam **no navegador**
- Permitem interatividade (hooks, eventos)

**Quando usar:**
- ✅ Precisa de hooks (`useState`, `useEffect`, `useRouter`)
- ✅ Event listeners (`onClick`, `onChange`, `onSubmit`)
- ✅ Browser APIs (`localStorage`, `window`, `document`)
- ✅ Bibliotecas client-only (`@dnd-kit`, `react-hook-form`)

```

**Por que funciona:**
- ✅ Busca dados no servidor (mais rápido, mais seguro)
- ✅ Interatividade no cliente (quando necessário)
- ✅ Menos JavaScript = app mais leve
- ✅ Melhor experiência do usuário

---

## 🔄 Server Actions

### 🎯 O que são

**Server Actions** são funções que rodam **no servidor** mas podem ser chamadas **do cliente**.

```
**Padrão de nomenclatura:**
- Verbos infinitivos: `buscar`, `atualizar`, `criar`, `deletar`
- Sempre em português (padrão do projeto)
- Um arquivo = uma responsabilidade

### ⚡ Server Actions vs React Query

**Por que NÃO usar React Query neste projeto:**

| Aspecto | React Query | Server Actions |
|---------|-------------|----------------|
| **Configuração** | Precisa providers, config | ✅ Zero config |
| **Cache** | Manual (queryClient) | ✅ Automático (revalidatePath) |
| **Loading states** | Manual (isLoading) | ✅ Automático (Suspense) |
| **Error handling** | Manual (isError) | ⚠️ try/catch |
| **Bundle size** | +13 KB | ✅ 0 KB (nativo) |
| **Server/Client** | Só cliente | ✅ Híbrido |
| **TypeScript** | Precisa generics | ✅ Inferido |

**React Query é ótimo para:**
- ❌ Aplicações SPA (sem SSR)
- ❌ Cache complexo com invalidação manual
- ❌ Real-time com polling

**Server Actions são melhores para:**
- ✅ Admin/backoffice (nosso caso)
- ✅ Server-first architecture
- ✅ Apps Next.js 15

---

## 🎯 Resumo: Por que essas escolhas?

### ✅ Organização de Componentes
- **Escala bem**: projeto cresce sem virar bagunça
- **Manutenibilidade**: fácil encontrar e modificar código
- **Segurança**: mudanças isoladas não quebram o sistema

### ✅ Server Components
- **Performance**: menos JavaScript no cliente
- **SEO**: conteúdo pré-renderizado
- **Segurança**: dados sensíveis no servidor
- **DX**: código mais simples

### ✅ Server Actions
- **Simplicidade**: menos boilerplate que API Routes
- **Type-safe**: TypeScript end-to-end
- **Cache automático**: revalidatePath() gerencia tudo
- **Nativo**: sem libs extras

---

**Última atualização:** Outubro 2025
**Versão:** 1.0.0
**Autor:** Equipe Midas-Supervisor
