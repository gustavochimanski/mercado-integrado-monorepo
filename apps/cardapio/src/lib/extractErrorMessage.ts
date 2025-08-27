// src/lib/extractErrorMessage.ts
export function extractErrorMessage(error: unknown, fallback = "Erro inesperado") {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as any).response;
    if ("data" in response && typeof response.data === "object") {
      const data = response.data;

      // caso detail seja string
      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }

      // caso detail seja array de erros { msg, ... }
      if ("detail" in data && Array.isArray(data.detail)) {
        return data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
      }
    }
  }

  return fallback;
}
