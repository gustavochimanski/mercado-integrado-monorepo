"use client";

import { Store, Clock, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@cardapio/components/Shared/ui/card";

interface BalcaoStepProps {
  // Não precisa de seleção de mesa, apenas confirmação
}

export default function BalcaoStep({}: BalcaoStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Retirada no Balcão</h2>
        <p className="text-sm text-muted-foreground">
          Seu pedido estará pronto para retirada no balcão do estabelecimento
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Store className="text-primary" size={48} />
            </div>
            
            <div className="w-full max-w-md">
              <h3 className="font-semibold text-lg mb-4">Como funciona?</h3>
              <ul className="text-sm text-muted-foreground space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <ShoppingBag className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>Você faz o pedido e escolhe a forma de pagamento</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>O tempo de preparo será informado após a confirmação do pedido</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>Quando o pedido estiver pronto, você será notificado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Store className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>Retire seu pedido no balcão do estabelecimento</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Importante</p>
              <p className="text-sm text-blue-700">
                Certifique-se de estar presente no estabelecimento para retirar seu pedido quando estiver pronto.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          Continue para escolher a forma de pagamento
        </p>
      </div>
    </div>
  );
}

