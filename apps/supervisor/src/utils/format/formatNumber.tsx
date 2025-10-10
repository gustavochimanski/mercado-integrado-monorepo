export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);

export const formatInt = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);
