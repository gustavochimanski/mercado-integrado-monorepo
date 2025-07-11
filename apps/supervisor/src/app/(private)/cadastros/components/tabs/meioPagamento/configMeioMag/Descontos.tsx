import { CardTitle } from "@supervisor/components/ui/card";
import { ConfiguracaoMeioPag } from "@supervisor/app/(private)/cadastros/types/typesMeioPag";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { FloatInput } from "@supervisor/components/shared/Inputs/floatInput";
import { CircleHelp } from "lucide-react";

interface DescontosSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}


const DescontosSettings: React.FC<DescontosSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {
    return(
    <div>
        <CardTitle className="ml-3 text-base flex w-full">Descontos</CardTitle>
        <div className="flex flex-wrap gap-2 justify-center md:justify-normal">
            {/* ===================================================*/}
            {/*=================== CODIGO PRECO ===================*/}
            {/* ===================================================*/}
            <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
            <div className="flex">
                <label htmlFor="CodigoPreco" className="block whitespace-nowrap p-1">
                Código Preço
                </label>
                <Popover>
                <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                <PopoverContent>
                    <strong><u>Código Preço</u> - </strong> Defina o código do preço.
                </PopoverContent>
                </Popover>
            </div>
            <Select
                value={
                configDadosMeioPgto.find((item) => item.nomeCampo === "CodigoPreco")?.integerValue.toString() ?? ""
                }
                onValueChange={(value) => handleChange("integerValue", Number(value), "CodigoPreco")}
            >
                <SelectTrigger id="CodigoPreco">
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="1">Preço 1</SelectItem>
                <SelectItem value="2">Preço 2</SelectItem>
                <SelectItem value="3">Preço 3</SelectItem>
                <SelectItem value="4">Preço 4</SelectItem>
                </SelectContent>
            </Select>
            </div>
        {/* ===================================================*/}
        {/*============== PERCENTUAL DE DESCONTO ==============*/}
        {/* ===================================================*/}
            <div className="flex flex-col mx-3 w-1/3 justify-center md:w-32">
                <div className="flex">
                    <label htmlFor="PercDesconto" className="block whitespace-nowrap p-1">
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
                    value={configDadosMeioPgto.find((item) => item.nomeCampo === "PercDesconto")?.doubleValue ?? 0}
                    onChangeValue={(value: number) => handleChange("doubleValue", value, "PercDesconto")}
                />
            </div>
            {/* =================================================== */}
            {/* ================== VALOR DESCONTO ================= */}
            {/* =================================================== */}
            <div className="flex flex-col mx-3 w-1/3 justify-center md:w-32">
            <div className="flex">
                <label htmlFor="ValorDesconto" className="block whitespace-nowrap p-1">
                Valor Desconto
                </label>
                <Popover>
                <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                <PopoverContent>
                    <strong><u>Valor de Desconto</u> - </strong> Especifique o valor fixo de desconto.
                </PopoverContent>
                </Popover>
            </div>
            <FloatInput
                value={configDadosMeioPgto.find((item) => item.nomeCampo === "ValorDesconto")?.doubleValue ?? 0}
                onChangeValue={(value: number) => handleChange("doubleValue", value, "ValorDesconto")}
            />
            </div>
            {/* =================================================== */}
            {/* ============= PERCENTUAL DE ACRESCIMO ============= */}
            {/* =================================================== */}
            <div className="flex flex-col mx-3 w-1/3 justify-center md:w-32">
            <div className="flex">
                <label htmlFor="PercAcrescimo" className="block whitespace-nowrap p-1">
                Perc Acréscimo
                </label>
                <Popover>
                <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                <PopoverContent>
                    <strong><u>Percentual de Acréscimo</u> - </strong> Defina o percentual de acréscimo.
                </PopoverContent>
                </Popover>
            </div>
            <FloatInput
                value={configDadosMeioPgto.find((item) => item.nomeCampo === "PercAcrescimo")?.doubleValue ?? 0}
                onChangeValue={(value: number) => handleChange("doubleValue", value, "PercAcrescimo")}
            />
            </div>
        </div>
    </div>
    )
}

export default DescontosSettings;