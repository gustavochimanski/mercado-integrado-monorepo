"use client";

import { useCart } from "@cardapio/stores/cart/useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@cardapio/components/Shared/ui/sheet";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, combos, receitas, totalPrice, clear, inc, dec, remove, incCombo, decCombo, removeCombo, incReceita, decReceita, removeReceita, observacao, setObservacao, editingPedidoId } = useCart();
  const router = useRouter();

  const isEditingMode = editingPedidoId !== null;
  const totalItems = items.length + (combos?.length ?? 0) + (receitas?.length ?? 0);

  function handleFinalizar() {
    if (totalItems === 0) return;
    onClose(); // fecha o Sheet
    router.push("/finalizar-pedido"); // redireciona para a página que faz o checkout
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="!max-w-full w-full p-2 gap-0 h-[80%] rounded-t-3xl rounded-b-none">
        <SheetHeader>
          <SheetTitle>
            {isEditingMode ? (
              <div className="flex flex-col gap-1">
                <span>Editando Pedido #{editingPedidoId}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Adicione ou remova produtos do pedido
                </span>
              </div>
            ) : (
              "Meu carrinho"
            )}
          </SheetTitle>
        </SheetHeader>

        <main className="p-2 overflow-y-auto space-y-2">
          {totalItems === 0 && <p className="text-sm text-muted-foreground">Carrinho vazio</p>}

          {/* Produtos */}
          {items.map((i) => {
            const precoItem = i.preco * i.quantity;
            // NOVO: Calcular preço dos complementos
            const precoComplementos = (i.complementos || []).reduce((sum, comp) => {
              const precoComp = comp.adicionais.reduce((s, a) => {
                const precoAdicional = a.adicional_preco || 0;
                return s + (precoAdicional * a.quantidade);
              }, 0);
              return sum + precoComp;
            }, 0) * i.quantity;
            // LEGADO: Suporte para adicionais antigos
            const precoAdicionaisLegado = (i.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * i.quantity;
            const precoTotalItem = precoItem + precoComplementos + precoAdicionaisLegado;

            return (
              <div key={i.cod_barras} className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{i.nome}</p>
                    
                    {/* NOVO: Complementos agrupados */}
                    {i.complementos && i.complementos.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {i.complementos.map((complemento) => (
                          <div key={complemento.complemento_id} className="pl-2 border-l-2 border-muted">
                            <p className="text-xs font-medium text-muted-foreground">
                              {complemento.complemento_nome || `Complemento ${complemento.complemento_id}`}:
                            </p>
                            {complemento.adicionais.map((adicional, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground pl-2">
                                • {adicional.adicional_nome || `Adicional ${adicional.adicional_id}`}
                                {adicional.quantidade > 1 && ` (${adicional.quantidade}x)`}
                                {adicional.adicional_preco && adicional.adicional_preco > 0 && (
                                  <span className="ml-1">
                                    R$ {(adicional.adicional_preco * adicional.quantidade).toFixed(2).replace(".", ",")}
                                  </span>
                                )}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* LEGADO: Adicionais antigos (deprecated) */}
                    {i.adicionais && i.adicionais.length > 0 && !i.complementos && (
                      <div className="mt-1 space-y-0.5">
                        {i.adicionais.map((adic) => (
                          <p key={adic.id} className="text-xs text-muted-foreground pl-2">
                            + {adic.nome}
                            {adic.preco > 0 && (
                              <span className="ml-1">
                                R$ {adic.preco.toFixed(2).replace(".", ",")}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {i.observacao && (
                      <p className="text-xs italic text-muted-foreground break-words max-w-[200px] mt-1">
                        {i.observacao}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {precoComplementos > 0 || precoAdicionaisLegado > 0 ? (
                        <>
                          R$ {precoItem.toFixed(2).replace(".", ",")} 
                          {(precoComplementos > 0 || precoAdicionaisLegado > 0) && (
                            <span className="text-muted-foreground/70">
                              {" + "}R$ {(precoComplementos + precoAdicionaisLegado).toFixed(2).replace(".", ",")} extras
                            </span>
                          )}
                          {" = "}R$ {precoTotalItem.toFixed(2).replace(".", ",")}
                        </>
                      ) : (
                        <>R$ {precoItem.toFixed(2).replace(".", ",")}</>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => dec(i.cod_barras)}>
                      -
                    </Button>
                    <span>{i.quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => inc(i.cod_barras)}>
                      +
                    </Button>
                  </div>

                  <Button size="icon" variant="ghost" onClick={() => remove(i.cod_barras)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            );
          })}

          {/* Combos */}
          {combos?.map((c) => {
            const precoCombo = c.preco * c.quantidade;
            // NOVO: Calcular preço dos complementos
            const precoComplementos = (c.complementos || []).reduce((sum, comp) => {
              const precoComp = comp.adicionais.reduce((s, a) => {
                const precoAdicional = a.adicional_preco || 0;
                return s + (precoAdicional * a.quantidade);
              }, 0);
              return sum + precoComp;
            }, 0) * c.quantidade;
            // LEGADO: Suporte para adicionais antigos
            const precoAdicionaisLegado = (c.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * c.quantidade;
            const precoTotalCombo = precoCombo + precoComplementos + precoAdicionaisLegado;

            return (
              <div key={`combo-${c.combo_id}`} className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{c.nome || `Combo #${c.combo_id}`}</p>
                    
                    {/* NOVO: Complementos agrupados */}
                    {c.complementos && c.complementos.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {c.complementos.map((complemento) => (
                          <div key={complemento.complemento_id} className="pl-2 border-l-2 border-muted">
                            <p className="text-xs font-medium text-muted-foreground">
                              {complemento.complemento_nome || `Complemento ${complemento.complemento_id}`}:
                            </p>
                            {complemento.adicionais.map((adicional, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground pl-2">
                                • {adicional.adicional_nome || `Adicional ${adicional.adicional_id}`}
                                {adicional.quantidade > 1 && ` (${adicional.quantidade}x)`}
                                {adicional.adicional_preco && adicional.adicional_preco > 0 && (
                                  <span className="ml-1">
                                    R$ {(adicional.adicional_preco * adicional.quantidade).toFixed(2).replace(".", ",")}
                                  </span>
                                )}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* LEGADO: Adicionais antigos (deprecated) */}
                    {c.adicionais && c.adicionais.length > 0 && !c.complementos && (
                      <div className="mt-1 space-y-0.5">
                        {c.adicionais.map((adic) => (
                          <p key={adic.id} className="text-xs text-muted-foreground pl-2">
                            + {adic.nome}
                            {adic.preco > 0 && (
                              <span className="ml-1">
                                R$ {adic.preco.toFixed(2).replace(".", ",")}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {c.observacao && (
                      <p className="text-xs italic text-muted-foreground break-words max-w-[200px] mt-1">
                        {c.observacao}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {precoComplementos > 0 || precoAdicionaisLegado > 0 ? (
                        <>
                          R$ {precoCombo.toFixed(2).replace(".", ",")} 
                          {(precoComplementos > 0 || precoAdicionaisLegado > 0) && (
                            <span className="text-muted-foreground/70">
                              {" + "}R$ {(precoComplementos + precoAdicionaisLegado).toFixed(2).replace(".", ",")} extras
                            </span>
                          )}
                          {" = "}R$ {precoTotalCombo.toFixed(2).replace(".", ",")}
                        </>
                      ) : (
                        <>R$ {precoCombo.toFixed(2).replace(".", ",")}</>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => decCombo(c.combo_id)}>
                      -
                    </Button>
                    <span>{c.quantidade}</span>
                    <Button size="icon" variant="outline" onClick={() => incCombo(c.combo_id)}>
                      +
                    </Button>
                  </div>

                  <Button size="icon" variant="ghost" onClick={() => removeCombo(c.combo_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            );
          })}

          {/* Receitas */}
          {receitas?.map((r) => {
            const precoReceita = r.preco * r.quantidade;
            // NOVO: Calcular preço dos complementos
            const precoComplementos = (r.complementos || []).reduce((sum, comp) => {
              const precoComp = comp.adicionais.reduce((s, a) => {
                const precoAdicional = a.adicional_preco || 0;
                return s + (precoAdicional * a.quantidade);
              }, 0);
              return sum + precoComp;
            }, 0) * r.quantidade;
            // LEGADO: Suporte para adicionais antigos
            const precoAdicionaisLegado = (r.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * r.quantidade;
            const precoTotalReceita = precoReceita + precoComplementos + precoAdicionaisLegado;

            return (
              <div key={`receita-${r.receita_id}`} className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.nome || `Receita #${r.receita_id}`}</p>
                    
                    {/* NOVO: Complementos agrupados */}
                    {r.complementos && r.complementos.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {r.complementos.map((complemento) => (
                          <div key={complemento.complemento_id} className="pl-2 border-l-2 border-muted">
                            <p className="text-xs font-medium text-muted-foreground">
                              {complemento.complemento_nome || `Complemento ${complemento.complemento_id}`}:
                            </p>
                            {complemento.adicionais.map((adicional, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground pl-2">
                                • {adicional.adicional_nome || `Adicional ${adicional.adicional_id}`}
                                {adicional.quantidade > 1 && ` (${adicional.quantidade}x)`}
                                {adicional.adicional_preco && adicional.adicional_preco > 0 && (
                                  <span className="ml-1">
                                    R$ {(adicional.adicional_preco * adicional.quantidade).toFixed(2).replace(".", ",")}
                                  </span>
                                )}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* LEGADO: Adicionais antigos (deprecated) */}
                    {r.adicionais && r.adicionais.length > 0 && !r.complementos && (
                      <div className="mt-1 space-y-0.5">
                        {r.adicionais.map((adic) => (
                          <p key={adic.id} className="text-xs text-muted-foreground pl-2">
                            + {adic.nome}
                            {adic.preco > 0 && (
                              <span className="ml-1">
                                R$ {adic.preco.toFixed(2).replace(".", ",")}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {r.observacao && (
                      <p className="text-xs italic text-muted-foreground break-words max-w-[200px] mt-1">
                        {r.observacao}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {precoComplementos > 0 || precoAdicionaisLegado > 0 ? (
                        <>
                          R$ {precoReceita.toFixed(2).replace(".", ",")} 
                          {(precoComplementos > 0 || precoAdicionaisLegado > 0) && (
                            <span className="text-muted-foreground/70">
                              {" + "}R$ {(precoComplementos + precoAdicionaisLegado).toFixed(2).replace(".", ",")} extras
                            </span>
                          )}
                          {" = "}R$ {precoTotalReceita.toFixed(2).replace(".", ",")}
                        </>
                      ) : (
                        <>R$ {precoReceita.toFixed(2).replace(".", ",")}</>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => decReceita(r.receita_id)}>
                      -
                    </Button>
                    <span>{r.quantidade}</span>
                    <Button size="icon" variant="outline" onClick={() => incReceita(r.receita_id)}>
                      +
                    </Button>
                  </div>

                  <Button size="icon" variant="ghost" onClick={() => removeReceita(r.receita_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            );
          })}
        </main>


        <div className=" border-t pt-1 mt-auto flex justify-between text-sm">
          <strong>
            <span>Total</span>
          </strong>
          <span className="font-semibold">R$ {totalPrice().toFixed(2)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={clear} className="flex-1">
            {isEditingMode ? "Cancelar Edição" : "Limpar"}
          </Button>
          <Button className="flex-1" onClick={handleFinalizar}>
            {isEditingMode ? "Atualizar Pedido" : "Finalizar pedido"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
