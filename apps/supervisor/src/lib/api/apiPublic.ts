// src/lib/api/apiMensura.ts
"use client";

import axios from "axios";

const apiPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


export default apiPublic;
