// GeneralSettings.tsx
import React from "react";
import { ConfiguracaoMeioPag } from "@supervisor/app/(private)/cadastros/types/typesMeioPag";
import { CardTitle } from "@supervisor/components/ui/card";
import { IntegerInput } from "@supervisor/components/shared/Inputs/integerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { CircleHelp } from "lucide-react";


interface GeneralSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {
  return (
    <div>
      <CardTitle className="ml-3 text-base">Geral</CardTitle>
      <div className="flex flex-wrap gap-2 font-sans justify-center md:justify-normal">
        {/* =================================================== */}
        {/* =============== GRUPO MEIO PAGAMENTO ============== */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="GrupoMeioPgto" className="block whitespace-nowrap p-1">
              Grupo
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Grupo Meio de Pagamento</u> - </strong> Defina o grupo ao qual este meio pertence.
              </PopoverContent>
            </Popover>
          </div>
          <IntegerInput
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "GrupoMeioPgto")?.integerValue ?? 0}
            onChange={(value) => handleChange("integerValue", value, "GrupoMeioPgto")}
          />
        </div>
        {/* =================================================== */}
        {/* ================ LIBERACAO SUPERVISOR ============= */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="LiberacaoSupervisor" className="block whitespace-nowrap p-1">
              Supervisor
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Liberação Supervisor</u> - </strong> Indica se o meio de pagamento solicitará liberação.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "LiberacaoSupervisor")?.stringValue ?? ""}
            onValueChange={(value) => handleChange("stringValue", value, "LiberacaoSupervisor")}
          >
            <SelectTrigger id="LiberacaoSupervisor">
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

export default GeneralSettings;
