"use client";

import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "lucide-react";
import { Card, CardFooter } from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";

interface Props {
  href: string;
}

export const CardVerMais = ({ href }: Props) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(href)}
      className="min-w-[100px] w-[100px] h-[180px] snap-start flex flex-col justify-between overflow-hidden p-0 border-dashed border-2 border-gray-300 hover:border-primary transition-colors cursor-pointer"
    >
      <div className="flex flex-col items-center gap-2 px-3 pt-3 flex-grow justify-center ">
        <ArrowRightCircle className="w-8 h-8 text-muted-foreground" />
        <div className="text-sm font-medium text-center w-full">
          Ver mais
        </div>
        <div className="text-sm text-center text-muted-foreground">Categoria completa</div>
      </div>

      <CardFooter className="p-0">
        <Button
          size="sm"
          className="w-full rounded-none text-sm"
          variant="secondary"
          onClick={() => router.push(href)}
        >
          Abrir
        </Button>
      </CardFooter>
    </Card>
  );
};
