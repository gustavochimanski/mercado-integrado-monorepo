import { useQuery } from "@tanstack/react-query"
import { mensuraApi } from "@supervisor/api/MensuraApi"

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => mensuraApi.auth.obterUsuarioAtualApiAuthMeGet(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  })
}
