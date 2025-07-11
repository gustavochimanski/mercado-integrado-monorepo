import { CardTitle } from "@supervisor/components/ui/card";
import { ConfiguracaoMeioPag } from "@supervisor/app/(private)/cadastros/types/typesMeioPag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { CircleHelp } from "lucide-react";
import { IntegerInput } from "@supervisor/components/shared/Inputs/integerInput";

interface ContraValeSettingsProps {
  configDadosMeioPgto: ConfiguracaoMeioPag[];
  handleChange: (key: keyof ConfiguracaoMeioPag, value: any, nomeCampo: string) => void;
}

const ContraValeSettings: React.FC<ContraValeSettingsProps> = ({ configDadosMeioPgto, handleChange }) => {

    return(
        <div>
            <CardTitle className="ml-3 text-base flex w-full">Contra Vale</CardTitle>
            <div className="flex flex-wrap gap-2 justify-center md:justify-normal">
                {/* ===================================================*/}
                {/*===============  EMITE CONTRA VALE  ================*/}
                {/* ===================================================*/}
                <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
                    <div className="flex">
                        <label htmlFor="EmiteContraVale" className="block whitespace-nowrap p-1">
                        Emite C.v
                        </label>
                        <Popover>
                        <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                        <PopoverContent>
                            <strong><u>Emite Contra Vale</u> - </strong> Defina se o meio de pagamento emite contra vale
                        </PopoverContent>
                        </Popover>
                    </div>
                <Select
                    value={configDadosMeioPgto.find((item) => item.nomeCampo === "EmiteContraVale")?.stringValue ?? ""}
                    onValueChange={(value) => handleChange("stringValue", value, "EmiteContraVale")}
                >
                    <SelectTrigger id="EmiteContraVale">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="S">Sim</SelectItem>
                    <SelectItem value="N">Não</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                {/* =========================================================  */}
                {/* ================ IDENTIFICACAO CONTRA VALE =============== */}
                {/* =========================================================  */}
                <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
                    <div className="flex">
                        <label htmlFor="IdentificacaoContraVale" className="block whitespace-nowrap p-1">
                        ID C.v
                        </label>
                        <Popover>
                        <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                        <PopoverContent>
                            <strong><u>Identificação Contra Vale</u> - </strong> Defina a identificação do contra vale
                        </PopoverContent>
                        </Popover>
                    </div>
                <Select
                    value={configDadosMeioPgto.find((item) => item.nomeCampo === "IdentificacaoContraVale")?.stringValue ?? ""}
                    onValueChange={(value) => handleChange("stringValue", value, "IdentificacaoContraVale")}
                >
                    <SelectTrigger id="IdentificacaoContraVale">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="D">Dinheiro</SelectItem>
                    <SelectItem value="C">Código</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                {/* =========================================================  */}
                {/* ==================== VIAS CONTRA VALE ===================  */}
                {/* =========================================================  */}
                <div className="flex flex-col mx-3 w-1/3 justify-center md:w-28">
                    <div className="flex">
                        <label htmlFor="ViasCv" className="block whitespace-nowrap p-1">
                        Vias C.v
                        </label>
                        <Popover>
                        <PopoverTrigger><CircleHelp size={13} /></PopoverTrigger>
                        <PopoverContent>
                            <strong><u>Vias Contra Vale</u> - </strong> Defina quantas vias de contra vale serão impressas ao final da conta
                        </PopoverContent>
                        </Popover>
                    </div>
                    <IntegerInput
                        value={configDadosMeioPgto.find((item) => item.nomeCampo === "ViasCv")?.integerValue ?? 0}
                        onChange={(value) => handleChange("integerValue", value, "ViasCv")}
                    />
                </div>
            </div>
        </div>
    )
}

export default ContraValeSettings;