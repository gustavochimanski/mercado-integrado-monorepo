"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";

type LoginDiretoLike = {
  mutate: (
    body: { telefone: string },
    opts?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => void;
  isPending?: boolean;
};

/**
 * Se a URL tiver `?client_number=...`, tenta fazer login do cliente automaticamente
 * usando o mesmo fluxo do "login direto" (telefone).
 *
 * - Não executa se o cliente já estiver autenticado (tokenCliente).
 * - Remove `client_number` da URL após sucesso para evitar re-login em refresh.
 */
export function useAutoLoginFromClientNumber(loginDireto: LoginDiretoLike) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawFromSearchParams = useMemo(() => {
    const raw = searchParams?.get("client_number");
    return raw?.trim() ?? "";
  }, [searchParams]);

  const telefoneDigits = useMemo(() => rawFromSearchParams.replace(/\D/g, ""), [rawFromSearchParams]);

  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!rawFromSearchParams) return;
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    // Já logado? Não faz nada.
    if (getTokenCliente()) return;

    // Sem telefone válido (mesma regra do modal: DDD + número)
    if (!telefoneDigits || telefoneDigits.length < 10) return;

    // Evitar disparo duplicado se estiver pendente
    if (loginDireto.isPending) return;

    loginDireto.mutate(
      { telefone: telefoneDigits },
      {
        onSuccess: () => {
          // Limpar o parâmetro da URL para não repetir em refresh
          const params = new URLSearchParams(searchParams?.toString() ?? "");
          params.delete("client_number");
          const next = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
          router.replace(next);
        },
      }
    );
  }, [loginDireto, pathname, rawFromSearchParams, router, searchParams, telefoneDigits]);
}

