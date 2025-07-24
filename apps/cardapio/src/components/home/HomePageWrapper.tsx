"use client";

import dynamic from "next/dynamic";

// 👇 Aqui sim você pode usar dynamic com `ssr: false`
const HomePage = dynamic(() => import("./Home"), { ssr: false });

export default function HomePageWrapper() {
  return <HomePage />;
}
