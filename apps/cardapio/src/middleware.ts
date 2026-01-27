import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Redirect para /landingpage-store ANTES de carregar a home (/)
 * quando ?empresa=X e a empresa tem landingpage_store === true.
 * Preserva via=supervisor na URL de destino.
 */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const empresaParam = request.nextUrl.searchParams.get("empresa")?.trim();
  if (!empresaParam || !/^\d+$/.test(empresaParam)) {
    return NextResponse.next();
  }

  const empresaId = parseInt(empresaParam, 10);
  if (!Number.isFinite(empresaId) || empresaId <= 0) {
    return NextResponse.next();
  }

  if (!API_URL) {
    return NextResponse.next();
  }

  try {
    const url = `${API_URL.replace(/\/$/, "")}/api/empresas/public/emp/lista?empresa_id=${empresaId}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.next();
    }

    const data = await res.json();
    const emp = Array.isArray(data) ? data[0] : data;

    if (emp?.landingpage_store) {
      const via = request.nextUrl.searchParams.get("via");
      const target = new URL("/landingpage-store", request.url);
      target.searchParams.set("empresa", String(empresaId));
      if (via === "supervisor") {
        target.searchParams.set("via", "supervisor");
      }
      return NextResponse.redirect(target);
    }
  } catch {
    // Em caso de erro (rede, timeout, etc.), deixa a Home tratar no client
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
