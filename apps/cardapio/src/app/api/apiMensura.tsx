// src/lib/api/apiMensura.ts
"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

const apiAdmin = axios.create({
  baseURL: "https://gerente.mensuraapi.com.br",
});

apiAdmin.interceptors.request.use((config) => {
  // pega o token do cookie (funciona no client)
  const token = getCookie("access_token");
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;
