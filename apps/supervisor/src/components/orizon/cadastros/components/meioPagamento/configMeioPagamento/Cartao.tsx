// CartaoSettings.tsx
import React from "react";
import { ConfiguracaoMeioPag } from "@supervisor/components/orizon/cadastros/types/typesMeioPag";
import { CardTitle } from "@supervisor/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { CircleHelp } from "lucide-react";

interface CartaoSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}

const CartaoSettings: React.FC<CartaoSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {
  return (
    <div>
      <CardTitle className="ml-3 text-base">Cartões</CardTitle>
      <div className="flex flex-wrap gap-2 justify-center md:justify-normal">
        {/* ===================================================*/}
        {/*===================  TIPO CARTÃO ===================*/}
        {/* ===================================================*/}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="TipoCartaoTef" className="block whitespace-nowrap p-1">
              Tipo Cartão
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Tipo Cartão</u> - </strong> Defina se é Crédito, Débito ou Pix.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "TipoCartaoTef")?.stringValue ?? ""}
            onValueChange={(value) => handleChange("stringValue", value, "TipoCartaoTef")}
          >
            <SelectTrigger id="TipoCartaoTef">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C">Crédito</SelectItem>
              <SelectItem value="D">Débito</SelectItem>
              <SelectItem value="P">Pix</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* ===================================================*/}
        {/*================  TIPO PARCELAMENTO ================*/}
        {/* ===================================================*/}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-36">
          <div className="flex">
            <label htmlFor="TipoParcCartao" className="block whitespace-nowrap p-1">
              Tipo Parc
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Tipo Parcelamento</u> - </strong> Defina o tipo de parcelamento.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "TipoParcCartao")?.stringValue ?? ""}
            onValueChange={(value) => handleChange("stringValue", value, "TipoParcCartao")}
          >
            <SelectTrigger id="TipoParcCartao">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">À vista</SelectItem>
              <SelectItem value="L">Loja</SelectItem>
              <SelectItem value="D">Administradora</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* ===================================================*/}
        {/*================== CARTÃO DIGITADO =================*/}
        {/* ===================================================*/}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="CartaoDigitado" className="block whitespace-nowrap p-1">
              Cartão Digitado
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Cartão Digitado</u> - </strong> Indica se o cartão é digitado manualmente.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "CartaoDigitado")?.stringValue ?? ""}
            onValueChange={(value) => handleChange("stringValue", value, "CartaoDigitado")}
          >
            <SelectTrigger id="CartaoDigitado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">Sim</SelectItem>
              <SelectItem value="N">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
    </div>
  );
};

export default CartaoSettings;
