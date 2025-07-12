// src/lib/api/apiMensura.ts
"use client";

import { getToken } from "@packs/auth/src/tokenStore";
import axios from "axios";

const apiAdmin = axios.create({
  baseURL: "https://gerente.mensuraapi.com.br",
});

apiAdmin.interceptors.request.use((config) => {
  const token = getToken(); // ✅ vem da memória
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;
