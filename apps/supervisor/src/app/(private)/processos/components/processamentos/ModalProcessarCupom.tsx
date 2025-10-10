
import LeftZeroInput from "@supervisor/components/shared/Inputs/LeftZeroInput";
import { Button } from "@supervisor/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { Modal } from "@supervisor/components/ui/modal";
import { CircleArrowRight, CircleX } from "lucide-react";
import { useState } from "react";

interface ModalProcessarCupomProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalProcessarCupom = ({ isOpen, onClose }: ModalProcessarCupomProps) => {

  const [empresa, setEmpresa] = useState<string>("");
  const [caixa, setCaixa] = useState<string>("");

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <Card>
        <CardHeader>
          <CardTitle>Processar Cupom</CardTitle>
        </CardHeader>

        <CardContent className="flex px-8 gap-4 pb-4 pt-2">
          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">Empresa</label>
            <LeftZeroInput
              maxLength={3}
              className="w-20"
              placeholder="Empresa"
              onFormattedChange={(val) => setEmpresa(val)}
              value={empresa}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">Nome Empresa</label>
            <Input placeholder="Nome Empresa" disabled />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">Caixa</label>
            <Input
              placeholder="Caixas"
              value={caixa}
              onChange={(evt) => setCaixa(evt.target.value)}
            />
          </div>
        </CardContent>

        <CardContent className="h-[50vh] px-8 overflow-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure atque nisi ab dignissimos, omnis at rerum repellat recusandae harum sint expedita pariatur saepe nostrum aliquam labore iusto praesentium libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti dolorum similique quae officiis facilis consequatur animi eos sit reiciendis cupiditate quidem, dignissimos inventore facere sed nobis aliquam quia error! Rem.
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <CircleX /> Cancelar
          </Button>
          <Button>
            <CircleArrowRight /> Enviar
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default ModalProcessarCupom;
