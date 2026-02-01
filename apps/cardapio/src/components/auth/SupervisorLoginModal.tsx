"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { toast } from "sonner";

import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Button } from "@cardapio/components/Shared/ui/button";

export default function SupervisorLoginModal() {
  const { login } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      void (async () => {
        try {
          setError("");
          await login(username, password);
          toast.success("Login realizado com sucesso!");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          const isConfigError =
            msg.includes("Base da API não definida") ||
            msg.includes("tenant_slug") ||
            msg.includes("api_base_url");
          const isNetworkError =
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code?: string }).code === "ERR_NETWORK";
          const message = isConfigError
            ? "Base da API não definida. O link do supervisor deve incluir ?tenant=slug (ex: /?empresa=1&via=supervisor&tenant=xmanski)."
            : isNetworkError
              ? "Não foi possível conectar à API. Verifique sua conexão ou se acessou pelo link correto do supervisor."
              : "Credenciais inválidas. Tente novamente.";
          setError(message);
          toast.error(message);
        }
      })();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md px-8 py-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Logo UNITEC"
            width={84}
            height={84}
            className="object-contain"
            draggable={false}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div className="text-center mb-8">
          <p className="text-xs text-slate-500 font-medium tracking-widest mb-2">
            GESTÃO E TECNOLOGIA
          </p>
          <h2 className="text-xl font-semibold text-slate-700">
            Login do Supervisor
          </h2>
          <p className="text-sm text-slate-500 mt-1">Insira suas credenciais para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-700 font-medium">
              Usuário
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="username"
                type="text"
                autoComplete="off"
                placeholder="Digite seu usuário"
                disabled={isPending}
                className="pl-10"
                value={username}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                disabled={isPending}
                className="pl-10 pr-11"
                value={password}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full font-semibold h-11 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isPending}
          >
            {isPending && (
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
