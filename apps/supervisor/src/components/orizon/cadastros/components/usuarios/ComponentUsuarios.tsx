// app/(private)/cadastros/components/tabs/usuarios/ComponentMainUsuarios.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import { getColumnsUsuarios, getPermissaoUsuarioColumns } from "./columnsUsuarios";
import { Button } from "@supervisor/components/ui/button";
import { CirclePlus, CircleX } from "lucide-react";
import { useFetchAllUsers } from "@supervisor/components/orizon/cadastros/hooks/useUsuarios";
import ModalInserirNovoUsuario from "./modalInserirNovoUsuario";

const ComponentUsuarios = () => {
  // ======= ESTADOS ========
  const [editModel, setEditModel] = useState<any>(null);
  const [ modalIncluirUsuario, setModalIncluirUsuario ] = useState(false)
  const { data: dataAllUsuarios } = useFetchAllUsers() // DADOS DOS USUÁRIOS

  const [permissoes, setPermissoes] = useState([
    { id: 1, nome: "Administrador" },
    { id: 2, nome: "Financeiro" },
    { id: 3, nome: "Estoquista" },
  ]);

  const handleEditar = (id: number) => {
    console.log("Editar")
  };
  

  const handleExcluirUsuario = (id: number) => {
    console.log("Excluir usuário", id);
  };

  const handleExcluirPermissao = (id: number) => {
    console.log("Excluir permissão", id);
    setPermissoes((prev) => prev.filter((p) => p.id !== id));
  };

  const usuarioColumns = getColumnsUsuarios(handleEditar, handleExcluirUsuario, setEditModel);

  const permissaoColumns = getPermissaoUsuarioColumns(handleExcluirPermissao);

  return (
    <div className="flex flex-row w-full overflow-auto h-full gap-4">
      {/* Card: Usuários */}
      <Card className="flex-1 ">
        <CardHeader>
          <CardTitle>Cadastro de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full">
          <DataTableComponentMui
            rows={dataAllUsuarios}
            columns={usuarioColumns}
            getRowId={(row) => row.id}
          />
        </CardContent>
        <CardFooter className="gap-4">
          <Button onClick={() => setModalIncluirUsuario(true)} variant={"secondary"}><CirclePlus/>Adicionar Usuário</Button>
          </CardFooter>
      </Card>

      {/* Card: Permissões */}
      <Card
        className={`flex-1 w-1/4 ${
          !editModel ? "opacity-60 pointer-events-none select-none" : ""
        }`}
      >
        <CardHeader>
          <CardTitle>Permissões do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full">
          <DataTableComponentMui
            rows={permissoes}
            columns={permissaoColumns}
            getRowId={(row) => row.id}
          />
        </CardContent>
        <CardFooter className="gap-4">
          <Button variant={"secondary"} disabled={!editModel}><CirclePlus/>Adicionar Permissão</Button>
          <Button variant={"secondaryDestructive"} disabled={!editModel} onClick={() => setEditModel(false)}><CircleX/>Cancelar</Button>
        </CardFooter>
      </Card>
      

      
      {/* ============================================= */}
      {/* =================== MODALS ===================*/}
      { modalIncluirUsuario && ( <ModalInserirNovoUsuario onClose={() => setModalIncluirUsuario(false)}/>)}
    </div>
  );
};

export default ComponentUsuarios;
