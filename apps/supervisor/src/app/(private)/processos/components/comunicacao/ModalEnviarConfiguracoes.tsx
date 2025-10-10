"use client"
import LeftZeroInput from "@supervisor/components/shared/Inputs/LeftZeroInput";
import { Button } from "@supervisor/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { Modal } from "@supervisor/components/ui/modal";
import { CircleArrowRight, CircleX } from "lucide-react";
import { useState } from "react";
import { useModalStore } from "@supervisor/store/useModalStore";

const ModalEnviarConfiguracao = () => {
  const { isEnviarConfiguracaoModalOpen, closeEnviarConfig } = useModalStore();

  const [empresa, setEmpresa] = useState<string>("");
  const [caixa, setCaixa] = useState<string>("");

  if (!isEnviarConfiguracaoModalOpen) return null;
  
  return (
    <Modal onClose={closeEnviarConfig}>
      <Card>
        <CardHeader>
          <CardTitle>Enviar Configuração</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col px-8 gap-4 pb-4 pt-2 md:flex-row">
            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Empresa</label>
              <LeftZeroInput  maxLength={3} className="w-20" placeholder="Empresa" onFormattedChange={(val) => setEmpresa(val)} value={empresa} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Nome Empresa</label>
              <Input placeholder="Nome Empresa" disabled />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Caixa</label>
              <Input placeholder="Caixa" onChange={(evt) => setCaixa(evt.target.value)}/>
            </div>
        </CardContent>

        <CardContent className="h-[50vh] px-8 overflow-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolore placeat officia, perspiciatis iure nobis hic consequuntur, nemo id, similique soluta pariatur magnam error beatae nulla culpa tempore corrupti deleniti! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic blanditiis commodi dolorem nobis veritatis iusto architecto minima quia facere? Quidem reiciendis dolore ea ut molestiae suscipit perspiciatis et, nisi consectetur.
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant={"outline"} onClick={closeEnviarConfig}>
            <CircleX/> Cancelar
          </Button>
          <Button >
            <CircleArrowRight/>Enviar
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default ModalEnviarConfiguracao;
