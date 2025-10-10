import { MensuraApiClient } from "@supervisor/api"
import type { OpenAPIConfig } from "@supervisor/api/core/OpenAPI";
import { getCookie } from "cookies-next";

export const mensuraApi = new MensuraApiClient({
  BASE: process.env.NEXT_PUBLIC_API_URL!,
  VERSION: "1.0.0",
  WITH_CREDENTIALS: false,
  CREDENTIALS: "same-origin",
  TOKEN: async () => {
    if (typeof window === "undefined") return "";
    const token = getCookie("access_token");
    return token && typeof token === "string" ? token : "";
  }
} satisfies Partial<OpenAPIConfig>);
