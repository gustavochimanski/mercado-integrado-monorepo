"use client"
import LeftZeroInput from "@supervisor/components/shared/Inputs/LeftZeroInput";
import { Button } from "@supervisor/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { Modal } from "@supervisor/components/ui/modal";
import { CircleArrowRight, CircleX } from "lucide-react";
import { useState } from "react";
import { useModalStore } from "@supervisor/store/useModalStore";

const ModalEnviarProdutos = () => {

  const {isEnviarProdutosModalOpen, closeEnviarProdutos} = useModalStore();
  
  const [empresa, setEmpresa] = useState<string>("");
  const [caixa, setCaixa] = useState<string>("");

  if (!isEnviarProdutosModalOpen) return null;

  return (
    <Modal onClose={closeEnviarProdutos}>
      <Card>
        <CardHeader>
          <CardTitle>Enviar Carga de Produtos</CardTitle>
        </CardHeader>

        <CardContent className="flex px-8 gap-4 pb-4 pt-2">
            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Empresa</label>
              <LeftZeroInput min={1} max={999} className="w-20" placeholder="Empresa" onFormattedChange={(val) => setEmpresa(val)} value={empresa} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Nome Empresa</label>
              <Input placeholder="Nome Empresa" disabled />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Caixa</label>
              <Input placeholder="Caixa" />
            </div>
        </CardContent>

        <CardContent className="h-[50vh] px-8 overflow-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ab optio amet, quas voluptates vitae dolor odio, temporibus alias reiciendis, illo error nisi aut fuga fugiat ipsum officiis qui perspiciatis Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos provident quam, sapiente distinctio quos assumenda doloremque quod ratione, sit explicabo nam ullam excepturi unde. Corrupti consectetur saepe autem eum voluptate.
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant={"outline"} onClick={closeEnviarProdutos}>
            <CircleX/> Cancelar
          </Button>
          <Button >
            <CircleArrowRight/>Enviar
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default ModalEnviarProdutos;
