"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { PieValueType } from "@mui/x-charts/models";
import { Card, CardContent, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import {  legendClasses } from "@mui/x-charts";
import TabelaParticipacaoDepartamentos from "./TabelaParticipacaoDepartamento";
import { chartColors } from "@supervisor/utils/dashColors";

// Tipo dos dados
export interface TypeTotaisPorDepartamento {
  departamento: string;
  total_vendas: number;
}

interface Props {
  data: TypeTotaisPorDepartamento[];
}

export default function ComponentParticipacaoDepartamentos({ data }: Props) {
    if (!data || !Array.isArray(data)) {
      return null; 
    }

  const vendas = data.map((d) => d.total_vendas);
  const totalVendas = vendas.reduce((acc, v) => acc + v, 0);

  const chartPieData: PieValueType[] = data.map((d, idx) => {
    const percentual = ((d.total_vendas / totalVendas) * 100).toFixed(1);
    return {
      id: idx,
      value: d.total_vendas,
      label: `${d.departamento} (${percentual}%)`,
      color: chartColors[idx % chartColors.length],
    };
  });


  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="pb-0">
        <CardTitle className="mx-4">Departamentos</CardTitle>
      </CardHeader>

      <CardContent className="md:p-2 p-3">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex justify-center items-center">
              <PieChart
                height={200}
                series={[
                  {
                    data: chartPieData,
                    cornerRadius: 3,
                    highlightScope: { fade: "global", highlight: "item" },
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "vertical",
                    markType: "circle",
                  },
                }}
                sx={{
                  width: "100%",
                  margin: 3,
                  [`& .${legendClasses.root}`]: { display: "none" },
                  [`& .${legendClasses.mark}`]: { width: 16, height: 16 },
                }}
              />
          </div>

          <div className="w-full">
            <TabelaParticipacaoDepartamentos
              data={data}
              cores={chartColors}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
