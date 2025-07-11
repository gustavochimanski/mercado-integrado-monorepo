"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@supervisor/components/ui/card";
import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import { SearchComponent } from "@supervisor/components/shared/searchComponent";
import { CircleCheck } from "lucide-react";
import { TypeCadProdDelivery } from "../../types/cadProdDeliveryType";
import { Input } from "@supervisor/components/ui/input";

import Image from "next/image";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@supervisor/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@supervisor/components/ui/dialog";

import { useCategorias } from "../../hooks/useCategorias";
import { Label } from "@supervisor/components/ui/label";
import { CategoryNode } from "../../types/categoriasDeliveryType";
import {
  useFetchCadProdDelivery,
  useMutateProduto,
} from "../../hooks/useQueryProduto";
import { useSubcategorias } from "../../hooks/useSecoes";
import { SecaoDelivery } from "../../types/subCategSecoesType";

// Função para renderizar categorias recursivamente
function renderCategoryOption(cat: CategoryNode, prefix = ""): JSX.Element[] {
  const label = prefix + cat.label;
  const item = (
    <SelectItem key={cat.id} value={String(cat.id)}>
      {label}
    </SelectItem>
  );
  const children =
    cat.children?.flatMap((child) =>
      renderCategoryOption(child, prefix + "— ")
    ) || [];
  return [item, ...children];
}

// Formulário
function FormNovoProduto({
  form,
  setForm,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  categorias,
  secoes,
}: any) {
  return (
    <form onSubmit={handleSubmit} className="gap-3 md:grid grid-cols-2">
      <div>
        <Label htmlFor="cod_barras">Código de barras</Label>
        <Input
          type="text"
          name="cod_barras"
          value={form.cod_barras}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="cod_categoria">Categoria</Label>
        <Select
          value={String(form.cod_categoria)}
          onValueChange={(val) =>
            setForm((prev: any) => ({
              ...prev,
              cod_categoria: parseInt(val),
              subcategoria_id: undefined,
            }))
          }
        >
          <SelectTrigger id="cod_categoria">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias?.map((cat: CategoryNode) =>
              renderCategoryOption(cat)
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subcategoria_id">Seção</Label>
        <Select
          value={form.subcategoria_id ? String(form.subcategoria_id) : ""}
          onValueChange={(val) =>
            setForm((prev: any) => ({
              ...prev,
              subcategoria_id: parseInt(val),
            }))
          }
        >
          <SelectTrigger id="subcategoria_id">
            <SelectValue placeholder="Selecione uma seção" />
          </SelectTrigger>
          <SelectContent>
            {secoes?.map((sec: SecaoDelivery) => (
              <SelectItem key={sec.id} value={String(sec.id)}>
                {sec.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="preco_venda">Preço de venda</Label>
        <Input
          type="number"
          name="preco_venda"
          value={String(form.preco_venda)}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="custo">Custo</Label>
        <Input
          type="number"
          name="custo"
          value={String(form.custo)}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="imagem">Imagem</Label>
        <Input
          type="file"
          name="imagem"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <DialogFooter className="col-span-2 mt-4">
        <Button type="submit" className="w-full">
          Salvar Produto
        </Button>
      </DialogFooter>
    </form>
  );
}

// Componente principal
const ComponentProdutos = () => {
  const empresaID = 1;
  const [showModalConfig, setShowModalConfig] = useState(false);

  const [form, setForm] = useState({
    cod_barras: "",
    descricao: "",
    cod_categoria: 1,
    preco_venda: 0,
    custo: 0,
    imagem: undefined as File | undefined,
    subcategoria_id: undefined as number | undefined,
  });

  const { data: categorias } = useCategorias();
  const { data: secoes } = useSubcategorias(empresaID, form.cod_categoria);
  const { data: dataProdutos } = useFetchCadProdDelivery(
    empresaID,
    1,
    30
  );

  const { mutate } = useMutateProduto();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imagem: file }));
  };

  // Volta a enviar FormData com imagem
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cod_barras", form.cod_barras);
    formData.append("descricao", form.descricao);
    formData.append("cod_categoria", String(form.cod_categoria));
    formData.append("preco_venda", String(form.preco_venda));
    formData.append("custo", String(form.custo));
    if (form.subcategoria_id !== undefined) {
      formData.append("subcategoria_id", String(form.subcategoria_id));
    }
    if (form.imagem) {
      formData.append("imagem", form.imagem);
    }

    mutate(formData, {
      onSuccess: () => {
        setShowModalConfig(false);
        setForm({
          cod_barras: "",
          descricao: "",
          cod_categoria: 1,
          preco_venda: 0,
          custo: 0,
          imagem: undefined,
          subcategoria_id: undefined,
        });
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Cadastro de Produtos</CardTitle>
        <SearchComponent className="w-full md:w-60" />
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-4 p-4">
          {dataProdutos?.data.map(
            (prod: TypeCadProdDelivery) => (
              <Card
                key={prod.cod_barras}
                className="shadow-sm border border-muted p-0 overflow-hidden flex flex-col"
              >
                {prod.imagem ? (
                  <Image
                    src={prod.imagem}
                    alt={prod.descricao ?? "Imagem do produto"}
                    width={300}
                    height={300}
                    className="w-full h-40 object-cover"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    Sem imagem
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div className="mb-2">
                    <h2 className="text-base font-semibold leading-tight truncate">
                      {prod.descricao}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {prod.cod_categoria} •{" "}
                      {prod.label_categoria ?? "Sem categoria"}
                    </p>
                  </div>

                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>
                      <strong>Barras:</strong> {prod.cod_barras}
                    </p>
                    <p>
                      <strong>Custo:</strong> R${" "}
                      {prod.custo?.toFixed(2)}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={() => setShowModalConfig(true)}
                  >
                    Editar
                  </Button>
                </div>
              </Card>
            )
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-4 mb-10">
        <Button onClick={() => setShowModalConfig(true)}>
          <CircleCheck className="mr-2 h-4 w-4" />
          Incluir
        </Button>
      </CardFooter>

      {showModalConfig && (
        <Dialog
          open={showModalConfig}
          onOpenChange={setShowModalConfig}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para adicionar um novo
                produto ao sistema.
              </DialogDescription>
            </DialogHeader>
            <FormNovoProduto
              form={form}
              setForm={setForm}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              categorias={categorias}
              secoes={secoes}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ComponentProdutos;
