"use client";

import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import { useMutateCliente } from "@supervisor/services/useQueryCliente";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  ativo: boolean;
}

export const ModalNovoCliente = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState<FormData>({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    data_nascimento: "",
    ativo: true,
  });

  const { create: createClienteMutate } = useMutateCliente();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, ativo: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação mínima
    if (!form.nome.trim()) return;

    try {
      // Preparar dados no formato correto da API (sem campo 'ativo')
      await createClienteMutate.mutateAsync({
        nome: form.nome.trim(),
        cpf: form.cpf.replace(/\D/g, ""), // Remove formatação do CPF
        telefone: form.telefone.replace(/\D/g, ""), // Remove formatação do telefone
        email: form.email.trim(),
        data_nascimento: form.data_nascimento,
      });

      // Fechar modal após sucesso
      onOpenChange(false);
      resetForm();

    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  const resetForm = () => {
    setForm({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      data_nascimento: "",
      ativo: true,
    });
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

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Validação básica
  const isFormValid = form.nome.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">            
            Novo Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              CPF *
            </Label>
            <Input
              id="cpf"
              name="cpf"
              value={form.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              required
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
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="ativo" className="flex items-center gap-2">
              Cliente Ativo
            </Label>
            <Switch
              id="ativo"
              checked={form.ativo}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || createClienteMutate.isPending}
              className="flex-1"
            >
              {createClienteMutate.isPending ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovoCliente;