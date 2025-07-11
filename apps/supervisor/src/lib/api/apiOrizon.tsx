// src/lib/api/apiMensura.ts
"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  // pega o token do cookie (funciona no client)
  const token = getCookie("access_token");
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
