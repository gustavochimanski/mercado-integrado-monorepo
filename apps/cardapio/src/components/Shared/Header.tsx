// src/components/Header/HeaderComponent.tsx

import React from "react";
// import Image from "next/image";
import { SearchBarComponent } from "./Search";
import { MapPinCheck } from "lucide-react";

const HeaderComponent = () => {
  return (
    <header className="w-full flex flex-col items-center shadow sticky top-0 z-50 bg-background rounded-b-lg p-2 pb-4 gap-2">
      {/* LOGO + NOME UM AO LADO DO OUTRO */}
      {/* <div className="flex items-center gap-4 h-12 justify-center w-full">
        <div className="bg-white rounded-full shadow-lg border-2 border-primary p-1 flex  w-16 h-16">
          <Image
            src={"/logo.jpg"}
            alt={"logo"}
            width={56}
            height={56}
            className="rounded-full object-cover"
            priority
          />
        </div>
        <h1 className="text-2xl font-semibold text-primary ">
          Gerente da Gelada 
        </h1>
      </div> */}
      {/* ENDEREÇO */}
      <p
        onClick={() => window.alert("Aqui vai abrir um modal ")}
        className="font-semibold text-gray-500 text-sm flex items-center gap-1 cursor-pointer"
      >
        <MapPinCheck size={15} />
        <u>Rua antonio de Oliveira Gago 83</u>
      </p>
      {/* BARRA DE BUSCA */}
      <SearchBarComponent />
    </header>
  );
};

export default HeaderComponent;
