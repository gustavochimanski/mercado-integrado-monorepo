"use client";

import { useUserContext } from "@cardapio/services/auth/userContext";
import { useState } from "react";

export default function LoginComponent() {
  const { login } = useUserContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await login(username, password); 
    } catch {
      window.alert("Credenciais inválidas");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">Login do Supervisor</h2>

        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
