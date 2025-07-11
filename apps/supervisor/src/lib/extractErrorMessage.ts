// src/lib/extractErrorMessage.ts
export function extractErrorMessage(error: unknown, fallback = "Erro inesperado") {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const response = (error as any).response;
    if ("data" in response && typeof response.data === "object") {
      const data = response.data;
      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }
    }
  }

  return fallback;
}
