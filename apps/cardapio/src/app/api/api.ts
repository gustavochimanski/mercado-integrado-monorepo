// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://gerente.mensuraapi.com.br",
});
