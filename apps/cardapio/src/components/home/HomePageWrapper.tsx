"use client";

import dynamic from "next/dynamic";
import { ApiConfigChecker } from "@cardapio/components/auth/api-config-checker";

// 👇 Aqui sim você pode usar dynamic com `ssr: false`
const HomePage = dynamic(() => import("./Home"), { ssr: false });

export default function HomePageWrapper() {
  return (
    <ApiConfigChecker>
      <HomePage />
    </ApiConfigChecker>
  );
}
