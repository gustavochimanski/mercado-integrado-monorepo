"use client";

import { useRef, useState } from "react";
import Barcode from "react-barcode";
import { Input } from "@supervisor/components/ui/input";
import { Button } from "@supervisor/components/ui/button";
import { Card,CardContent,CardFooter,CardHeader, CardTitle } from "@supervisor/components/ui/card";
import { gerarPdfEtiquetas } from "@supervisor/utils/pdf/gerarPdfEtiquetasUsuarios"; 
import { CircleHelp, CirclePlus, CircleX, Download } from "lucide-react";
import saveAs from "file-saver";
import { Popover, PopoverTrigger, PopoverContent } from "@supervisor/components/ui/popover";
import Image from 'next/image';


// Define o tipo de cada etiqueta
type Etiqueta = {
  nome: string;
  codigo: string;
  base64: string;
};

function gerarEAN13(codigoUsuario: string): string {
  if (codigoUsuario.length < 4 || codigoUsuario.length > 5) {
    throw new Error("Código precisa ter 4 ou 5 dígitos");
  }

  const qtdeCodigoUsuario = codigoUsuario.length;
  const qtdeAleatorios = 6 - (qtdeCodigoUsuario - 4);
  const max = Math.pow(10, qtdeAleatorios) - 1;
  const min = Math.pow(10, qtdeAleatorios - 1);
  const aleatorios = Math.floor(min + Math.random() * (max - min)).toString();
  const digitoLivre = Math.floor(Math.random() * 10).toString();
  const base = `1${aleatorios}${codigoUsuario}${digitoLivre}`;
  const verificador = calcularDigitoVerificadorEAN13(base);
  return `${base}${verificador}`;
}

function calcularDigitoVerificadorEAN13(codigo: string): number {
  if (codigo.length !== 12) throw new Error("Código base precisa ter 12 dígitos");
  const soma = codigo
    .split("")
    .map((num, i) => parseInt(num) * (i % 2 === 0 ? 1 : 3))
    .reduce((acc, val) => acc + val, 0);
  const resto = soma % 10;
  return resto === 0 ? 0 : 10 - resto;
}

const ComponentEtiquetasUsuarios = () => {
  // Estados para o formulário
  const [nome, setNome] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Armazena as etiquetas geradas
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  // Estado temporário para o barcode invisível
  const [barcodeTemp, setBarcodeTemp] = useState<string>("");
  const barcodeRef = useRef<HTMLDivElement>(null);

  // Ao adicionar uma nova etiqueta, gera o código e captura a imagem do barcode via canvas
  const handleAdicionarEtiqueta = () => {
    if (etiquetas.length >= 9) {
      alert("Máximo de 9 códigos atingido.");
      return;
    }
    try {
      const codigoFinal = gerarEAN13(codigoUsuario);
      setBarcodeTemp(codigoFinal);
      // Aguarda 100ms para que o Barcode seja renderizado na div invisível
      setTimeout(() => {
        const canvas = barcodeRef.current?.querySelector("canvas");
        if (!canvas) {
          alert("Erro ao capturar o código de barras.");
          return;
        }
        const base64 = canvas.toDataURL("image/png");
        const novaEtiqueta: Etiqueta = {
          nome: nome || "Sem Nome",
          codigo: codigoFinal,
          base64,
        };
        setEtiquetas((prev) => [...prev, novaEtiqueta]);
        // Limpa os inputs
        setNome("");
        setCodigoUsuario("");
      }, 100);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Chama a função que gera o PDF com todas as etiquetas
  const handleBaixarPdf = async () => {
    if (etiquetas.length === 0) {
      alert("Nenhuma etiqueta para gerar.");
      return;
    }
  
    const blob = await gerarPdfEtiquetas(etiquetas);
    saveAs(blob, "etiquetas_supervisores.pdf"); // 👈 força o download
  };
  
    // Função para cancelar tudo, limpando todas as etiquetas, inputs e estado do barcode
    const handleCancelarTudo = () => {
      setEtiquetas([]);
      setNome("");
      setCodigoUsuario("");
      setBarcodeTemp("");
    };
  

  return (
    <div className="p-2 flex flex-col md:flex-row gap-4 flex-1 h-full">
      {/* Formulário: Nome + Código */}
      <Card className="flex flex-col gap-4 flex-1 items-center justify-center">
        <CardHeader className="flex flex-row gap-2 justify-center">
          <CardTitle className="text-lg">Gerador de Códigos de Barras</CardTitle>
          <Popover>
            <PopoverTrigger><CircleHelp size={15}/></PopoverTrigger>
            <PopoverContent> 
              Este gerador permite criar etiquetas com <strong>código de barras no padrão EAN-13</strong>, associadas ao nome e código do usuário.
              <br />
              Você pode adicionar vários usuários e gerar um <strong>PDF</strong> com todas as etiquetas prontas para impressão.
          </PopoverContent>
          </Popover>
        </CardHeader>

         <CardContent className="flex flex-col w-2/5 gap-2 text-sm mb-8">
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Nome do usuário</label>
              <Input
                value={nome}  
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Código do usuário (4-5 dígitos)</label>
              <Input
                type="number"
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                placeholder="Ex: 1234"
              />
            </div>
        </CardContent> 

        {/* ============ BUTTONS ============ */}
        <CardFooter className="flex gap-3">
          <Button onClick={handleAdicionarEtiqueta}  >
            <CirclePlus/> Adcionar
          </Button>
          <Button onClick={handleCancelarTudo}  variant={"destructive"}>
            <CircleX/> Cancelar 
          </Button>
           <Button onClick={handleBaixarPdf} variant={"secondary"} >
            <Download/> Baixar Pdf
          </Button>
          </CardFooter>
      </Card>


      {/* Barcode invisível para captura do canvas */}
      <div className="invisible absolute -z-10" ref={barcodeRef}>
      {barcodeTemp && (
  <Barcode
    value={barcodeTemp}
    renderer="canvas"
    width={2} // aumenta a densidade (padrão é 1)
    height={100} // deixa mais alto também
    margin={0}
    background="#ffffff"
    displayValue={false}
  />
)}

      </div>

      {/* Pré-visualização (Quadrado) */}
      <div className="flex-1 h-full">
        <div className="flex justify-center h-full">
          {/* O Card ocupa 100% do espaço disponível (com aspecto quadrado) */}
          <Card className=" w-full h-full max-w-full">
            <div className="grid grid-cols-3 gap-4 p-4 ">
              {etiquetas.map((etiqueta, index) => (
                <div key={index} className="flex flex-col items-center border p-2 rounded">
                  <Image
                    src={`data:image/png;base64,${etiqueta.base64}`}
                    alt={`Código ${etiqueta.codigo}`}
                    width={300}
                    height={300}
                    className="w-full object-contain"
                  />
                  <p className="mt-2 text-sm font-medium text-center">{etiqueta.nome}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComponentEtiquetasUsuarios;
