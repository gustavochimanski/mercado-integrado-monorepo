// src/app/login/layout.tsx

import { Toaster } from "@supervisor/components/ui/toaster";
import { ReactQueryProvider } from "@supervisor/providers/ReactQueryProvider";
import "@supervisor/app/(private)/globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="overflow-hidden">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
