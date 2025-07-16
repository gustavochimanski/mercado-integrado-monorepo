// TrocoSettings.tsx
import React, { useState } from "react";
import { ConfiguracaoMeioPag } from "@supervisor/components/orizon/cadastros/types/typesMeioPag";
import { CardTitle } from "@supervisor/components/ui/card";
import { FloatInput } from "@supervisor/components/shared/Inputs/floatInput";
import { IntegerInput } from "@supervisor/components/shared/Inputs/integerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { CircleHelp } from "lucide-react";

interface TrocoSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}

const TrocoSettings: React.FC<TrocoSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {
  
  const [permiteTroco, setPermiteTroco] = useState("N")


  return (
    <div>
      <CardTitle className="m-3 text-base">Troco</CardTitle>
      <div className="flex flex-wrap gap-2 font-sans  justify-center md:justify-normal">
        {/* =================================================== */}
        {/* ================== PERMITE TROCO ================== */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="PermiteTroco" className="block whitespace-nowrap p-1">
              Permite Troco
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Permite Troco</u> - </strong> Indica se o meio de pagamento aceita troco.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={permiteTroco}
            onValueChange={() => setPermiteTroco("S")}
          >
            <SelectTrigger id="PermiteTroco">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">Sim</SelectItem>
              <SelectItem value="N">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* =================================================== */}
        {/* =================== TROCO MÁXIMO ================== */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="TrocoMaximo" className="block whitespace-nowrap p-1">
              Troco Máximo
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Troco Máximo</u> - </strong> Defina o valor máximo de troco permitido.
              </PopoverContent>
            </Popover>
          </div>
          <FloatInput
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "TrocoMaximo")?.doubleValue ?? 0}
            onChangeValue={(value: number) => handleChange("doubleValue", value, "TrocoMaximo")}
            disabled={permiteTroco !== "S"}
          />
        </div>
        {/* =================================================== */}
        {/* ========== MEIO DE PAGAMENTO PARA TROCO =========== */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="MpgtoTroco" className="block whitespace-nowrap p-1">
              M.P Troco
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>M.P Troco</u> - </strong> Defina o código do meio de pagamento usado para troco.
              </PopoverContent>
            </Popover>
          </div>
          <IntegerInput
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "MpgtoTroco")?.integerValue ?? 0}
            onChange={(value) => handleChange("integerValue", value, "MpgtoTroco")}
            disabled={permiteTroco !== "S"}
          />
        </div>
        {/* =================================================== */}
        {/* =========== LIBERACAO SUPERVISOR TROCO ============ */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
          <div className="flex">
            <label htmlFor="LiberacaoSupervisorTroco" className="block whitespace-nowrap p-1">
              Lib. Sup. Troco
            </label>
            <Popover>
              <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
              <PopoverContent>
                <strong><u>Liberação Supervisor para Troco</u> - </strong> Indica se o troco requer liberação.
              </PopoverContent>
            </Popover>
          </div>
          <Select
            value={configDadosMeioPgto.find((item) => item.nomeCampo === "LiberacaoSupervisorTroco")?.stringValue ?? ""}
            onValueChange={(value) => handleChange("stringValue", value, "LiberacaoSupervisorTroco")}
            disabled={permiteTroco !== "S"}
          >
            <SelectTrigger id="LiberacaoSupervisorTroco">
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

export default TrocoSettings;
