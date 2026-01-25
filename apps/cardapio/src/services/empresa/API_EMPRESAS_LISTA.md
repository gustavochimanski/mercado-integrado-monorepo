# Endpoint Público – Lista de Empresas

## Visão geral

Endpoint **GET** `/api/empresas/public/emp/lista` para listar empresas ou buscar uma empresa específica por ID. **Não requer autenticação.**

- **Com `empresa_id`**: retorna um **objeto único** com dados completos (logo, horários).
- **Sem `empresa_id`**: retorna um **array** de empresas (sem `horarios_funcionamento`).

---

## Parâmetros de query

| Parâmetro    | Tipo     | Obrigatório | Descrição                                                                 |
|-------------|----------|-------------|----------------------------------------------------------------------------|
| `empresa_id`| `number` | Não         | ID da empresa. Se informado, retorna objeto único em vez de lista.        |
| `q`         | `string` | Não         | Busca por nome ou slug.                                                    |
| `cidade`    | `string` | Não         | Filtro por cidade.                                                         |
| `estado`    | `string` | Não         | Filtro por estado (ex.: `"PR"`, `"SP"`).                                   |
| `limit`     | `number` | Não         | Limite de resultados (padrão: 100, máx.: 500).                             |

---

## Respostas

### Com `empresa_id` (objeto único)

**Exemplo:** `GET /api/empresas/public/emp/lista?empresa_id=1`

- **200 OK**: objeto `EmpresaPublic` com `horarios_funcionamento` quando houver.
- **404 Not Found**: `{ "detail": "Empresa não encontrada" }`.

### Sem `empresa_id` (lista)

**Exemplo:** `GET /api/empresas/public/emp/lista`

- **200 OK**: array de `EmpresaDisponivel`. `horarios_funcionamento` é sempre `null`.

---

## Tipos no projeto

Ver `@cardapio/services/empresa/types`:

- `EmpresaPublic` – empresa com detalhes (objeto único).
- `EmpresaDisponivel` – item da lista.
- `HorarioDia` – horários de um dia (`dia_semana`, `intervalos`).
- `HorarioIntervalo` – `inicio` / `fim` no formato `"HH:MM"`.

`dia_semana`: `0` = domingo, `1` = segunda, …, `6` = sábado.

---

## Uso no frontend

### Listar empresas

```tsx
import { useListarEmpresas } from "@cardapio/services/empresa";

const { data: empresas } = useListarEmpresas({
  filtros: { q: "pizza", cidade: "Curitiba", estado: "PR", limit: 10 },
});
```

### Buscar empresa por ID

```tsx
import { useBuscarEmpresa } from "@cardapio/services/empresa";

const { data: empresa } = useBuscarEmpresa({ empresaId: 123 });
// empresa?.horarios_funcionamento
```

### Formatar horários

```tsx
import { formatarHorarios } from "@cardapio/lib/empresa/formatarHorarios";

if (empresa?.horarios_funcionamento) {
  console.log(formatarHorarios(empresa.horarios_funcionamento));
}
```

---

## Erros

- **404**: empresa inexistente ao usar `empresa_id`.
- **422**: parâmetros inválidos (ex.: `limit` > 500).

---

## Endpoints relacionados

- **GET** `/api/empresas/public/emp/?empresa_id=X` – dados completos (timezone, endereço etc.).
