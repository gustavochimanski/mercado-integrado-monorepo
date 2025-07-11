// components/formSubCategoria.tsx

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@supervisor/components/ui/form";
import { Label } from "@supervisor/components/ui/label";
import { Input } from "@supervisor/components/ui/input";
import { DialogFooter } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";

import { useState } from "react";
import { useMutateCategoria } from "../../hooks/useMutateCategoria";

// Validação de esquema com Zod
const schema = z.object({
  descricao: z.string().min(2), // nome mínimo 2 caracteres
  slug: z.string().optional(),
  imagem: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size <= 2 * 1024 * 1024, "Máx. 2 MB"), // limite 2MB
});
type FormData = z.infer<typeof schema>;

interface Props {
  parentSlug: string | null; // slug do nó pai (ou null se raiz)
  onClose: () => void;       // função para fechar o diálogo
}

export default function FormSubcategoria({ parentSlug, onClose }: Props) {
  // Inicializa React Hook Form com validação Zod
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { descricao: "", slug: "" },
  });

  // Hook para criar a subcategoria
  const { createSub } = useMutateCategoria(parentSlug);

  // Estado e preview da imagem selecionada
  const file = form.watch("imagem");
  const [preview, setPreview] = useState<string | null>(null);
  if (file instanceof File && !preview) {
    setPreview(URL.createObjectURL(file));
  }

  // Função chamada ao submeter o formulário
  async function onSubmit(data: FormData) {
    await createSub.mutateAsync({
      descricao: data.descricao.trim(),
      // se slug não informado, gera via slugify
      slug: data.slug || slugify(data.descricao, { lower: true }),
      imagem: data.imagem,
    });
    form.reset();  // limpa formulário
    onClose();     // fecha diálogo
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        encType="multipart/form-data" // necessário para file upload
      >
        {/* Campo NOME */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <Label>Nome</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo IMAGEM */}
        <FormField
          control={form.control}
          name="imagem"
          render={({ field }) => (
            <FormItem>
              <Label>Imagem</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const arquivo = e.target.files?.[0];
                  field.onChange(arquivo);
                  if (arquivo) setPreview(URL.createObjectURL(arquivo));
                }}
              />
              {/* Pré-visualização */}
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 mt-2 object-cover rounded"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botões de Cancelar e Salvar */}
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
