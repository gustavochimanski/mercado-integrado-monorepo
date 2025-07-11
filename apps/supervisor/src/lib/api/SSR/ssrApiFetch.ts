// lib/ssrApiFetch.ts
import { AxiosInstance } from "axios";
import { getApiServer } from "./apiSSR";

export async function ssrApiFetch<T>(
  cb: (api: AxiosInstance) => Promise<T>
): Promise<T> {
  // ✔️ agora espera a instância pronta
  const api = await getApiServer();
  return cb(api);
}
