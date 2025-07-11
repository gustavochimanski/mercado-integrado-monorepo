import axios, { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string | undefined => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    // Se o status for 404, retorne uma mensagem customizada
    if (axiosError.response?.status === 404) {
      return "Recurso não encontrado (404). Verifique se o endpoint está correto.";
    }
    const data = axiosError.response?.data as any;
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].message;
    }
    return axiosError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return undefined;
};
