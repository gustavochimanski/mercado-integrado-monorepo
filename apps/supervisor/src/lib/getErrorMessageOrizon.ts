import axios, { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string | undefined => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as any;

    // Se houver detail (padrão FastAPI)
    if (data?.detail) {
      // pode ser string ou array
      if (typeof data.detail === "string") return data.detail;
      if (Array.isArray(data.detail)) return data.detail[0];
    }

    // Se houver array de errors (padrão outro backend)
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].message;
    }

    // Caso especial para 404
    if (axiosError.response?.status === 404) {
      return "Recurso não encontrado (404). Verifique se o endpoint está correto.";
    }

    // fallback
    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
};
