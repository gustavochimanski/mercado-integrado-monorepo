// src/hooks/useLoginForm.ts
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@supervisor/services/Auth/useAuth";
import { useToast } from "@supervisor/hooks/use-toast";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";

// ✅ esquema de validação com zod
export const loginSchema = z.object({
  username: z.string().min(1, "Usuário obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data); // ✅ usar os dados, não o form controller
    } catch (err) {
      const msg = extractErrorMessage(err, "Usuário ou senha inválidos.");
      toast({
        variant: "destructive",
        title: "Login falhou",
        description: msg,
      });
    }
  };

  return {
    form,
    onSubmit,
    isLoggingIn,
  };
}
