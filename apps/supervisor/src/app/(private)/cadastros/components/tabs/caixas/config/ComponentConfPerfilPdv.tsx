import { useFetchAllPerfil } from "@supervisor/app/(private)/cadastros/hooks/usePerfisDeCaixa";
import { Button } from "@supervisor/components/ui/button";
import { CardFooter, CardHeader } from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { CardContent } from "@mui/material";
import { CircleCheck, CircleX } from "lucide-react";

type Props = {
  dataSSR: any;
  modoEdicao?: boolean;
  setModoEdicao?: (ativo: boolean) => void;
  idPerfilSelected: string | undefined;
  setIdPerfilSelected: (id: string) => void; // Função para atualizar o id do perfil
  setRowSelected: (row: any) => void; // Atualiza o rowSelected no componente pai
};

const CardConfigPerfilPdv = ({
  dataSSR,
  modoEdicao,
  setModoEdicao,
  idPerfilSelected,
  setIdPerfilSelected,
  setRowSelected
}: Props) => {

  const { data: dataAllPerfilPdv } = useFetchAllPerfil();

  if (!dataSSR) return <div className="mx-6">Selecione um <strong>caixa</strong> para visualizar.</div>;
  
  const confPerfil = dataSSR.perfilPdv?.confPerfil;
  if (!confPerfil || !Array.isArray(confPerfil)) {
    return <div>Nenhuma configuração encontrada.</div>;
  }

  // Função para lidar com a troca de perfil
  const handlePerfilChange = (value: string) => {
    setIdPerfilSelected(value);
    setRowSelected((prevRow: { perfilPdv: any; }) => ({
      ...prevRow,
      perfilPdv: {
        ...prevRow.perfilPdv,
        id: value
      }
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="flex flex-row gap-4">
        <Input disabled value={idPerfilSelected} className="w-12 mt-2 bg-foreground/30 text-center" />

        <Select value={idPerfilSelected} onValueChange={handlePerfilChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            {dataAllPerfilPdv?.map((perfil) => (
              <SelectItem key={perfil.id} value={String(perfil.id)}>
                {perfil.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-4 text-xs h-full">
        {confPerfil.map((config: any) => (
          <div
            key={config.id}
            className="flex flex-col w-[calc(50%-0.5rem)] min-w-[50px] max-w-[100px]"
          >
            <label className="font-semibold">{config.property}</label>
            <Input
              defaultValue={config.value}
              name={config.property}
              className="h-8"
              disabled={!modoEdicao}
            />
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button>
          <CircleCheck />Gravar
        </Button>
        <Button variant="secondary" onClick={() => setModoEdicao?.(false)}>
          <CircleX />Cancelar
        </Button>
      </CardFooter>
    </div>
  );
};

export default CardConfigPerfilPdv;
