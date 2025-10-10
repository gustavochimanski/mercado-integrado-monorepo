import { PEDIDO_STATUS } from '@/lib/constants/pedido-status'
import type { PedidoStatus } from '@/types/pedido'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: PedidoStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = PEDIDO_STATUS[status]

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold',
        config.color,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  )
}
