"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@cardapio/stores/cart/useCart";
import {
  getCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
  setEnderecoPadraoId,
  setMeioPagamentoId,
} from "@cardapio/stores/client/ClientStore";
import { useFinalizarPedido } from "@cardapio/services/useFinalizarPedido";
import { useQueryEnderecos, useMutateEndereco, EnderecoCreate } from "@cardapio/services/useQueryEndereco";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@cardapio/components/Shared/ui/card";
import { CircleArrowRight, CircleCheck, Loader2 } from "lucide-react";
import Tabs from "@cardapio/components/Shared/ui/tabs";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@cardapio/components/Shared/ui/radio-group";
import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";

export default function FinalizarPedidoPage() {
  const { items, totalPrice, clear, observacao } = useCart();
  const { finalizarPedido, loading } = useFinalizarPedido();
  const router = useRouter();

  const cliente = getCliente();

  const [currentTab, setCurrentTab] = useState<"endereco" | "pagamento" | "revisao">("endereco");

  // Endereço
  const enderecoId = getEnderecoPadraoId();
  const { data: enderecos = [] } = useQueryEnderecos(cliente.tokenCliente, { enabled: !!cliente.tokenCliente });
  const { create } = useMutateEndereco(cliente.tokenCliente ?? "");

  const [showClienteModal, setShowClienteModal] = useState(false);

  useEffect(() => {
    if (!cliente?.tokenCliente) {
      setShowClienteModal(true);
    }
  }, [cliente]);

  // Pagamento
  const meioPagamentoId = getMeioPagamentoId();
  const meiosPagamento = [
    { id: 1, nome: "Dinheiro" },
    { id: 2, nome: "Cartão de Crédito" },
    { id: 3, nome: "PIX" },
  ];

  const handleFinalizar = async () => {
    try {
      await finalizarPedido();
      clear();
      router.push("/pedido-confirmado");
    } catch (err) {
      console.error("Erro ao finalizar pedido", err);
    }
  };

  const renderFooterButton = () => {
    if (currentTab === "endereco") {
      return (
        <Button
          className="w-full text-lg p-6 bg-yellow-600"
          onClick={() => setCurrentTab("pagamento")}
        >
          Continuar para Pagamento <CircleArrowRight strokeWidth={3} />
        </Button>
      );
    }
    if (currentTab === "pagamento") {
      return (
        <Button
          className="w-full text-lg p-6 bg-indigo-800"
          onClick={() => setCurrentTab("revisao")}
        >
          Revisar Pedido <CircleArrowRight strokeWidth={3}/>
        </Button>
      );
    }
    if (currentTab === "revisao") {
      return (
        <Button
          onClick={handleFinalizar}
          disabled={loading || items.length === 0}
          className="w-full text-lg p-6 bg-green-600"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Enviando pedido...
            </div>
          ) : (
            <div className="flex gap-3"> 
              Confirmar Pedido <CircleCheck className="my-auto" strokeWidth={3} />
            </div>
          )}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 p-4">
      <ClienteIdentificacaoModal
        open={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onConfirm={() => setShowClienteModal(false)}
      />

      <Card className="p-2 shadow-md h-[80vh] flex flex-col">
        <CardHeader>
          <h1 className="text-2xl font-bold">Finalizar Pedido</h1>
        </CardHeader>

        <CardContent className="flex-1">
          <Tabs
            value={currentTab}
            onValueChange={(v) => setCurrentTab(v as any)}
            items={[
              {
                value: "endereco",
                label: "Endereço",
                Component: () => (
                  <EnderecoStep
                    enderecos={enderecos}
                    enderecoId={enderecoId}
                    onSelect={(id: number) => setEnderecoPadraoId(id)}
                    onAdd={(novo: EnderecoCreate) => create.mutate(novo)}
                    token_cliente={cliente.tokenCliente}
                  />
                ),
              },
              {
                value: "pagamento",
                label: "Pagamento",
                Component: () => (
                  <PagamentoStep
                    meios={meiosPagamento}
                    selecionado={meioPagamentoId}
                    onSelect={(id: number) => setMeioPagamentoId(id)}
                  />
                ),
              },
              {
                value: "revisao",
                label: "Revisão",
                Component: () => (
                  <RevisaoStep
                    items={items}
                    observacao={observacao}
                    endereco={enderecos.find((e) => e.id === enderecoId)}
                    pagamento={meiosPagamento.find((m) => m.id === meioPagamentoId)}
                    total={totalPrice()}
                  />
                ),
              },
            ]}
          />
        </CardContent>

        <CardFooter className="w-full">
          {renderFooterButton()}
        </CardFooter>
      </Card>
    </div>
  );
}

/* ------------------- SUB COMPONENTES ------------------- */

function EnderecoStep({ enderecos, enderecoId, onSelect, onAdd }: any) {
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState(String(enderecoId ?? ""));

  const [novo, setNovo] = useState({
    logradouro: "",
    numero: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  useEffect(() => {
    setSelected(String(enderecoId ?? ""));
  }, [enderecoId]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Escolha o Endereço</h2>

      <RadioGroup value={selected} onValueChange={(id) => { setSelected(id); onSelect(Number(id)); }}>
        {enderecos.map((e: any) => (
          <div key={e.id} className="flex items-center gap-2">
            <RadioGroupItem value={String(e.id)} id={`end-${e.id}`} />
            <Label htmlFor={`end-${e.id}`}>
              {e.logradouro}, {e.numero} - {e.bairro} ({e.cidade})
            </Label>
          </div>
        ))}
      </RadioGroup>

      {adding ? (
        <div className="space-y-2 border p-3 rounded-md">
          <Input placeholder="Rua" value={novo.logradouro} onChange={(e) => setNovo({ ...novo, logradouro: e.target.value })} />
          <Input placeholder="Número" value={novo.numero} onChange={(e) => setNovo({ ...novo, numero: e.target.value })} />
          <Input placeholder="Cidade" value={novo.cidade} onChange={(e) => setNovo({ ...novo, cidade: e.target.value })} />
          <Input placeholder="Estado" value={novo.estado} onChange={(e) => setNovo({ ...novo, estado: e.target.value })} />
          <Input placeholder="CEP" value={novo.cep} onChange={(e) => setNovo({ ...novo, cep: e.target.value })} />

          <Button
            onClick={() => {
              onAdd({ ...novo });
              setAdding(false);
            }}
          >
            Salvar Endereço
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)}>
          + Adicionar novo endereço
        </Button>
      )}
    </div>
  );
}

function PagamentoStep({ meios, selecionado, onSelect }: any) {
  const [selected, setSelected] = useState(String(selecionado ?? ""));

  useEffect(() => {
    setSelected(String(selecionado ?? ""));
  }, [selecionado]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
      <RadioGroup value={selected} onValueChange={(id) => { setSelected(id); onSelect(Number(id)); }}>
        {meios.map((m: any) => (
          <div key={m.id} className="flex items-center gap-2">
            <RadioGroupItem value={String(m.id)} id={`pg-${m.id}`} />
            <Label htmlFor={`pg-${m.id}`}>{m.nome}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function RevisaoStep({ items, observacao, endereco, pagamento, total }: any) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Revisão</h2>

      <div>
        <h3 className="font-semibold">Itens:</h3>
        <ul className="space-y-1">
          {items.map((item: any) => (
            <li key={item.cod_barras}>
              {item.quantity}x {item.nome} – R$ {(item.preco * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <p><strong>Observação:</strong> {observacao || "Nenhuma"}</p>
      <p><strong>Endereço:</strong> {endereco ? `${endereco.logradouro}, ${endereco.numero}` : "Não informado"}</p>
      <p><strong>Pagamento:</strong> {pagamento?.nome || "Não informado"}</p>

      <div className="bg-gray-100 p-3 rounded-lg text-lg font-bold flex justify-between">
        <span>Total:</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
