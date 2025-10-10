"use client";

import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { Modal } from "@supervisor/components/ui/modal";
import { CircleCheck, CircleX } from "lucide-react";
import { Label } from "@supervisor/components/ui/label";
import { usePostNewPerfil } from "@supervisor/components/orizon/cadastros/hooks/usePerfisDeCaixa";

interface Props {
  onClose: () => void;
}

const ModalIncluiPerfilPdv = ({ onClose }: Props) => {
  const [descricao, setDescricao] = useState("");
  const [value, setValue] = useState("");

  const { mutate: incluiNewPerfil } = usePostNewPerfil();

  const handleSalvar = () => {
    incluiNewPerfil(descricao);
    onClose();
  }

  return (
    <Modal
    onClose={onClose}
    style={{
        width: "24rem",
        height: "15rem",
        display: "flex",
        flexDirection: "column",
    }}
    >
    <CardHeader>
        <h2 className="text-lg font-bold">Incluir Perfil no PDV</h2>
    </CardHeader>

    <CardContent className="flex-1 px-4 flex flex-col justify-between py-6">
        <div className="flex flex-col gap-2">
        <Label htmlFor="descricao">Descrição do perfil</Label>
        <Input
            id="descricao"
            placeholder="Ex: Perfil Pdv 001"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
        />
        </div>
    </CardContent>

    <CardFooter className="flex gap-2 justify-between px-4 py-4">
        <Button variant="default" onClick={handleSalvar}>
        <CircleCheck className="mr-2" /> Salvar
        </Button>
        <Button variant="outline" onClick={onClose}>
        <CircleX className="mr-2" /> Cancelar
        </Button>
    </CardFooter>
    </Modal>

  );
};

export default ModalIncluiPerfilPdv;
