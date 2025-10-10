// src/providers/ReactQueryProvider.tsx
"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface Props {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutos
          retry: 1, // só tenta mais 1x em caso de falha
          refetchOnWindowFocus: false,
        },
      },
      queryCache: new QueryCache({
        onError: (error, query) => {
          if (query.state.data !== undefined) {
            console.warn("[React Query] Erro em query com dados cacheados", error);
          } else {
            console.error("[React Query] Erro em query sem dados:", error);
          }
        },
      }),
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools opcionais: só em dev */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
