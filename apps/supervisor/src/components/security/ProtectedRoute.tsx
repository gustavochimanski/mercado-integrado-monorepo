// src/components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";  // continua usando js-cookie no client

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");  // <— aqui ajustado

    if (!token) {
      router.replace("/login");
    } else {
      setChecking(false); // encontrou o token, libera o conteúdo
    }
  }, [router]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-muted-foreground">
        Verificando sessão...
      </div>
    );
  }

  return <>{children}</>;
}
