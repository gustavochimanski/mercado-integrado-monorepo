// TicketSettings.tsx
import React from "react";
import { ConfiguracaoMeioPag } from "@supervisor/components/orizon/cadastros/types/typesMeioPag";
import { CardTitle } from "@supervisor/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { FloatInput } from "@supervisor/components/shared/Inputs/floatInput";
import { CircleHelp } from "lucide-react";

interface TicketSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}

const TicketSettings: React.FC<TicketSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {
  return (
    <div>
      <CardTitle className="ml-3 text-base flex w-full">Tickets</CardTitle>
      <div className="flex flex-wrap gap-2 justify-start md:justify-normal">
        {/* =================================================== */}
        {/* ================== DESCONTO TICKET ================ */}
        {/* =================================================== */}
        <div className="flex flex-col mx-3 w-1/3 justify-center md:w-32">
            <div className="flex">
                <label htmlFor="DescontoTicket" className="block whitespace-nowrap p-1">
                Perc Desconto
                </label>
                <Popover>
                <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                <PopoverContent>
                    <strong><u>Percentual de Desconto</u> - </strong> Defina o percentual de desconto.
                </PopoverContent>
                </Popover>
            </div>
            <FloatInput
                value={configDadosMeioPgto.find((item) => item.nomeCampo === "DescontoTicket")?.doubleValue ?? 0}
                onChangeValue={(value: number) => handleChange("doubleValue", value, "DescontoTicket")}
            />
        </div>
      </div>
    </div>
  );
};

export default TicketSettings;
