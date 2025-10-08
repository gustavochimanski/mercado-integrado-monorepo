import * as fs from 'fs';
import * as path from 'path';


// HELPERS
function toPascalCase(str: string): string {
  return str
    .replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\s+/g, '');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal[0].toLowerCase() + pascal.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function toSingular(str: string): string {
  if (str.endsWith('s')) return str.slice(0, -1);
  return str;
}


// TEMPLATES DAS ACTIONS
interface TemplateContext {
  [key: string]: string
}

const TEMPLATES = {
  'get-list': (ctx: TemplateContext) => `'use server'

import { cache } from 'react'
import { cookies } from 'next/headers'

interface Get${ctx.moduleName}Params {
  page?: number
  limit?: number
  search?: string
}

export const get${ctx.moduleName} = cache(async (params: Get${ctx.moduleName}Params = {}) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const { page = 1, limit = 20, search = '' } = params

  try {
    const response = await fetch(
      \`\${process.env.NEXT_PUBLIC_API_URL}/${ctx.moduleNameKebab}?page=\${page}&limit=\${limit}&search=\${search}\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar ${ctx.moduleNameKebab}')
    }

    return response.json()
  } catch (error) {
    console.error('Get ${ctx.moduleNameKebab} error:', error)
    throw error
  }
})
`,

  'get-by-id': (ctx: TemplateContext) => `'use server'

import { cache } from 'react'
import { cookies } from 'next/headers'

export const get${ctx.moduleNameSingular}ById = cache(async (id: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  try {
    const response = await fetch(
      \`\${process.env.NEXT_PUBLIC_API_URL}/${ctx.moduleNameKebab}/\${id}\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Get ${ctx.moduleNameKebabSingular} by id error:', error)
    return null
  }
})
`,

  'create': (ctx: TemplateContext) => `'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function create${ctx.moduleNameSingular}Action(data: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/${ctx.moduleNameKebab}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${token}\`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erro ao criar ${ctx.moduleNameKebabSingular}' }
    }

    const ${ctx.moduleNameCamelSingular} = await response.json()

    revalidatePath('/${ctx.moduleNameKebab}')

    return { success: true, data: ${ctx.moduleNameCamelSingular} }
  } catch (error) {
    console.error('Create ${ctx.moduleNameKebabSingular} error:', error)
    return { success: false, error: 'Erro ao criar ${ctx.moduleNameKebabSingular}' }
  }
}
`,

  'update': (ctx: TemplateContext) => `'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function update${ctx.moduleNameSingular}Action(id: string, data: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/${ctx.moduleNameKebab}/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${token}\`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erro ao atualizar ${ctx.moduleNameKebabSingular}' }
    }

    const ${ctx.moduleNameCamelSingular} = await response.json()

    revalidatePath('/${ctx.moduleNameKebab}')
    revalidatePath(\`/${ctx.moduleNameKebab}/\${id}\`)

    return { success: true, data: ${ctx.moduleNameCamelSingular} }
  } catch (error) {
    console.error('Update ${ctx.moduleNameKebabSingular} error:', error)
    return { success: false, error: 'Erro ao atualizar ${ctx.moduleNameKebabSingular}' }
  }
}
`,

  'delete': (ctx: TemplateContext) => `'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function delete${ctx.moduleNameSingular}Action(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/${ctx.moduleNameKebab}/\${id}\`, {
      method: 'DELETE',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erro ao deletar ${ctx.moduleNameKebabSingular}' }
    }

    revalidatePath('/${ctx.moduleNameKebab}')

    return { success: true }
  } catch (error) {
    console.error('Delete ${ctx.moduleNameKebabSingular} error:', error)
    return { success: false, error: 'Erro ao deletar ${ctx.moduleNameKebabSingular}' }
  }
}
`,
};


// GERAR ARQUIVO
function generateFile(content: string, filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ ${filePath.replace(process.cwd(), '')}`);
}


// MAIN
function main() {
  const moduleName = process.argv[2];

  if (!moduleName) {
    console.error('❌ Uso: npm run gen:actions <NomeDoModulo>');
    console.error('   Exemplo: npm run gen:actions Fornecedores');
    process.exit(1);
  }

  const plural = toPascalCase(moduleName);
  const singular = toPascalCase(toSingular(moduleName));

  const ctx = {
    moduleName: plural,
    moduleNameSingular: singular,
    moduleNameKebab: toKebabCase(moduleName),
    moduleNameKebabSingular: toKebabCase(toSingular(moduleName)),
    moduleNameCamel: toCamelCase(moduleName),
    moduleNameCamelSingular: toCamelCase(toSingular(moduleName)),
  };

  const baseDir = path.join(process.cwd(), 'src', 'actions', ctx.moduleNameKebab);

  console.log(`\n🚀 Gerando Server Actions para '${ctx.moduleName}'...\n`);

  // Gerar actions
  generateFile(TEMPLATES['get-list'](ctx), `${baseDir}/get-${ctx.moduleNameKebab}.ts`);
  generateFile(TEMPLATES['get-by-id'](ctx), `${baseDir}/get-${ctx.moduleNameKebabSingular}-by-id.ts`);
  generateFile(TEMPLATES['create'](ctx), `${baseDir}/create-${ctx.moduleNameKebabSingular}.ts`);
  generateFile(TEMPLATES['update'](ctx), `${baseDir}/update-${ctx.moduleNameKebabSingular}.ts`);
  generateFile(TEMPLATES['delete'](ctx), `${baseDir}/delete-${ctx.moduleNameKebabSingular}.ts`);

  console.log(`\n✨ Server Actions geradas com sucesso!\n`);
  console.log(`📁 Pasta: src/actions/${ctx.moduleNameKebab}/\n`);
}

main();
