// src/lib/extractErrorMessage.ts
export function extractErrorMessage(error: unknown, fallback = "Erro inesperado") {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as any).response;
    if ("data" in response && typeof response.data === "object") {
      const data = response.data;

      if (typeof data === "string") {
        return data;
      }

      if (Array.isArray(data)) {
        return data
          .map((item: any) => {
            if (typeof item === "string") return item;
            if (item?.message) return String(item.message);
            if (item?.msg) return String(item.msg);
            return JSON.stringify(item);
          })
          .join(", ");
      }

      // caso detail seja string
      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }

      // caso detail seja array de erros { msg, ... }
      if ("detail" in data && Array.isArray(data.detail)) {
        return data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
      }

      if ("detail" in data && typeof data.detail === "object") {
        const detail = data.detail;
        if (detail?.message) return String(detail.message);
        if (detail?.msg) return String(detail.msg);
        return JSON.stringify(detail);
      }

      if (data?.message) {
        return String(data.message);
      }

      return JSON.stringify(data);
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
