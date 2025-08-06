"use client";

import { getToken } from "@cardapio/stores/token/tokenStore";
import axios from "axios";

// ✅ Use variável de ambiente
const apiAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiAdmin.interceptors.request.use((config) => {
  const token = getToken(); // ✅ vem da memória
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;
