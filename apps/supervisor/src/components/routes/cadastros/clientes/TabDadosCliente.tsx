"use client";

import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import { useUpdateCliente } from "@supervisor/services/useQueryPedidoAdmin";
import { useToast } from "@supervisor/hooks/use-toast";

interface TabDadosClienteProps {
  cliente: any;
  onSaved: () => void;
}

interface FormData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  ativo: boolean;
}

export default function TabDadosCliente({ cliente, onSaved }: TabDadosClienteProps) {
  const [form, setForm] = useState<FormData>({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    data_nascimento: "",
    ativo: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const updateClienteMutation = useUpdateCliente();

  // Preencher form com dados do cliente
  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        cpf: cliente.cpf || "",
        telefone: cliente.telefone || "",
        email: cliente.email || "",
        data_nascimento: cliente.data_nascimento ? cliente.data_nascimento.split('T')[0] : "",
        ativo: cliente.ativo ?? true,
      });
    }
  }, [cliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, ativo: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cliente?.id) return;

    // Validação adicional no frontend
    if (!form.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!form.telefone.trim()) {
      toast({
        title: "Erro de validação",
        description: "Telefone é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados no formato correto da API
      const clienteData = {
        nome: form.nome.trim(),
        cpf: form.cpf.replace(/\D/g, ""), // Remove formatação do CPF
        telefone: form.telefone.replace(/\D/g, ""), // Remove formatação do telefone
        email: form.email.trim(),
        data_nascimento: form.data_nascimento,
        ativo: form.ativo
      };

      // Chamar API de atualização
      await updateClienteMutation.mutateAsync({
        clienteId: cliente.id,
        data: clienteData
      });

      onSaved();

    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setForm((prev) => ({ ...prev, cpf: formatted }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setForm((prev) => ({ ...prev, telefone: formatted }));
  };

  // Validação básica
  const isFormValid = form.nome.trim() && form.telefone.trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-auto">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2">
            <User size={16} />
            Nome *
          </Label>
          <Input
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        {/* CPF */}
        <div className="space-y-2">
          <Label htmlFor="cpf" className="flex items-center gap-2">
            <CreditCard size={16} />
            CPF
          </Label>
          <Input
            id="cpf"
            name="cpf"
            value={form.cpf}
            onChange={handleCPFChange}
            placeholder="000.000.000-00"
            maxLength={14}
            disabled // Normalmente CPF não deve ser editável
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="telefone" className="flex items-center gap-2">
            <Phone size={16} />
            Telefone
          </Label>
          <Input
            id="telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleTelefoneChange}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={16} />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="cliente@email.com"
          />
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-2">
          <Label htmlFor="data_nascimento" className="flex items-center gap-2">
            <Calendar size={16} />
            Data de Nascimento
          </Label>
          <Input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={handleChange}
          />
        </div>

        {/* Status Ativo */}
        <div className="flex items-center justify-between">
          <Label htmlFor="ativo" className="flex items-center gap-2">
            Cliente Ativo
          </Label>
          <Switch
            id="ativo"
            checked={form.ativo}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>

      {/* Botão fixo no final */}
      <div className="sticky bottom-0 bg-background pt-4 border-t">
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting || updateClienteMutation.isPending}
          className="w-full"
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
