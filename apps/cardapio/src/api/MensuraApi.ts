import { MensuraApiClient } from "@cardapio/api"
import type { OpenAPIConfig } from "@cardapio/api/core/OpenAPI";

export const mensuraApi = new MensuraApiClient({
  BASE: process.env.NEXT_PUBLIC_API_URL!,
  VERSION: "1.0.0",
  WITH_CREDENTIALS: false,
  CREDENTIALS: "same-origin",
  TOKEN: async () => {
    if (typeof window === "undefined") return "";
    const match = document.cookie.match(/(^| )access_token=([^;]+)/);
    return match ? match[2] : "";
    }
} satisfies Partial<OpenAPIConfig>);
