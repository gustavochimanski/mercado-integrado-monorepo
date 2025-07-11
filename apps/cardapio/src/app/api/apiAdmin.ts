// src/lib/api/apiMensura.ts
"use client";

import axios from "axios";

const apiAdmin = axios.create({
  baseURL: "/api/proxy/mensura",
});

export default apiAdmin;
