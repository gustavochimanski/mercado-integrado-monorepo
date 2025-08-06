import axios from "axios";

// ✅ Usa mesma URL de ambiente
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
