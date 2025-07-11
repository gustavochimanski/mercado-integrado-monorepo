export const dashboardMock = {
    meiosPagamento: {
      por_empresa: [
        {
          empresa: "001",
          meios: [
            { tipo: "PIX", valorTotal: 61200.80 },
            { tipo: "Crédito TEF", valorTotal: 42800.55 },
            { tipo: "Débito TEF", valorTotal: 32750.30 },
            { tipo: "Crédito POS", valorTotal: 29800.00 },
            { tipo: "Débito POS", valorTotal: 25320.45 },
            { tipo: "Dinheiro", valorTotal: 49850.70 },
            { tipo: "Alimentação", valorTotal: 18750.90 },
          ],
        },
        {
          empresa: "003",
          meios: [
            { tipo: "PIX", valorTotal: 32000 },
            { tipo: "Crédito TEF", valorTotal: 22000 },
            { tipo: "Débito POS", valorTotal: 15000 },
            { tipo: "Dinheiro", valorTotal: 42000 },
          ],
        },
      ],
    },
    // você pode adicionar outros dados como `compras`, `vendaPorHora` etc
  };
  