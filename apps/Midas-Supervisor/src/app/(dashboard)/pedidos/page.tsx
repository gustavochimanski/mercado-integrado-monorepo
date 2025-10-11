import { PedidosContainer } from './_components/pedido/pedidos-container'
import { buscarPedidosKanban } from '@/actions/pedidos/buscar-pedidos'
import { buscarEmpresas } from '@/actions/empresas/buscar-empresas'
import { getCurrentUser } from '@/actions/auth/get-current-user'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Pedidos | Midas Supervisor',
  description: 'Gerenciamento de pedidos em formato Kanban',
}

interface PedidosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PedidosPage({ searchParams }: PedidosPageProps) {
  const params = await searchParams
  const dataParam = params.data as string | undefined

  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  const dataHoje = `${ano}-${mes}-${dia}`

  // Se não há data na URL, redireciona com a data de hoje
  if (!dataParam) {
    const empresaIdParam = params.empresa_id as string | undefined
    if (empresaIdParam) {
      redirect(`/pedidos?data=${dataHoje}&empresa_id=${empresaIdParam}`)
    } else {
      redirect(`/pedidos?data=${dataHoje}`)
    }
  }

  const dataFormatada = dataParam

  const currentUser = await getCurrentUser()
  const resultadoEmpresas = await buscarEmpresas()
  const todasEmpresas = resultadoEmpresas.data || []

  const empresasDisponiveis =
    currentUser?.empresa_ids && currentUser.empresa_ids.length > 0
      ? todasEmpresas.filter((empresa) =>
          currentUser.empresa_ids!.includes(empresa.id)
        )
      : todasEmpresas

  const empresaIdParam = params.empresa_id as string | undefined
  const empresaId =
    empresaIdParam || empresasDisponiveis[0]?.id.toString() || '1'

  const resultado = await buscarPedidosKanban(dataFormatada, empresaId)

  // Se houver erro, mostra mensagem
  if (!resultado.success) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-destructive">
            Erro ao carregar pedidos
          </p>
          <p className="text-sm text-muted-foreground">
            {resultado.error || 'Tente novamente mais tarde'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <PedidosContainer
      pedidosIniciais={resultado.data || []}
      empresas={empresasDisponiveis}
      dataInicial={dataFormatada}
      empresaIdInicial={empresaId}
    />
  )
}
