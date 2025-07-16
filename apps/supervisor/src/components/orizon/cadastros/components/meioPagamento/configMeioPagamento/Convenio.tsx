// ConvenioSettings.tsx
import React from "react";
import { ConfiguracaoMeioPag } from "@supervisor/components/orizon/cadastros/types/typesMeioPag";
import { CardTitle } from "@supervisor/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { IntegerInput } from "@supervisor/components/shared/Inputs/integerInput";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { CircleHelp } from "lucide-react";
import { Separator } from "@supervisor/components/ui/separator";

interface ConvenioSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}

const ConvenioSettings: React.FC<ConvenioSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {
  return (
    <div>
      <CardTitle className="ml-3 text-base flex w-full">Convênio</CardTitle>
      <div className="flex flex-wrap gap-2 justify-center md:justify-normal">
        {/* ===================================================*/}
        {/*============== IDENTIFICACAO CONVENIO ==============*/}
        {/* ===================================================*/}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="IdentificacaoConvenio" className="block whitespace-nowrap p-1">
              Entrada
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Tipo Entrada Convênio</u> - </strong> Defina o tipo de entrada para o convênio.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "IdentificacaoConvenio")?.stringValue ?? ""}
            onValueChange={(value) => handleChange("stringValue", value, "IdentificacaoConvenio")}
          >
            <SelectTrigger id="IdentificacaoConvenio">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P">Padrão</SelectItem>
              <SelectItem value="C">Código</SelectItem>
              <SelectItem value="J">Cpf/Cnpj</SelectItem>
              <SelectItem value="T">Cartão</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* ===================================================*/}
        {/*=================== VIAS CONVENIO ==================*/}
        {/* ===================================================*/}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="ViasConvenio" className="block whitespace-nowrap p-1">
              Vias
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Número de Vias</u> - </strong> Defina quantas cópias do recibo serão impressas.
              </PopoverContent>
            </Popover>
          </div>
          <IntegerInput
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "ViasConvenio")?.integerValue ?? 0}
            onChange={(value) => handleChange("integerValue", value, "ViasConvenio")}
          />
        </div>
      </div>
      
    </div>
  );
};

export default ConvenioSettings;
