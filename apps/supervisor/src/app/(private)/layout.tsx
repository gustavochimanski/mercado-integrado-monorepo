// src/app/(private)/layout.tsx
import "./globals.css";
import ClientLayout from "@supervisor/components/security/ClientLayout";
import ProtectedRoute from "@supervisor/components/security/ProtectedRoute";
import { ReactQueryProvider } from "@supervisor/providers/ReactQueryProvider";
import { ReauthProvider } from "@supervisor/providers/ReauthProvider";

export const metadata = {
  title: "Unitec",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Unitec",
    statusBarStyle: "black-translucent",
  },
};

export function generateViewport() {
  return {
    themeColor: "#000000",
    viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body >
        <ReactQueryProvider>
          <ReauthProvider>
            <ProtectedRoute>
              <ClientLayout>{children}</ClientLayout>
            </ProtectedRoute>
          </ReauthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
