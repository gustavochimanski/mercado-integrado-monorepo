// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://mensuraapi.com.br",
});
