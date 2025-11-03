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
      className="w-[140px] h-[200px] snap-start flex flex-col justify-center items-center overflow-hidden p-0 border-dashed border-2 border-gray-300 hover:border-primary transition-all duration-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-gray-50"
    >
      <div className="flex flex-col items-center gap-3 px-3 flex-grow justify-center">
        <ArrowRightCircle className="w-10 h-10 text-primary" />
        <div className="text-sm font-medium text-center text-gray-700">
          Ver mais
        </div>
      </div>
    </Card>
  );
};
