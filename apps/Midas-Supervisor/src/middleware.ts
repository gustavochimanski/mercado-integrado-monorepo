import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("access_token")?.value

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ["/login"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Se é rota pública, permitir acesso
  if (isPublicRoute) {
    // Se já está logado e tenta acessar /login, redirecionar para home
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Se não tem token e está tentando acessar rota protegida, redirecionar para login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Validar token JWT (verificar se não está expirado)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Math.floor(Date.now() / 1000)

    // Se token expirou, redirecionar para login
    if (payload.exp && payload.exp < currentTime) {
      const loginUrl = new URL("/login", request.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete("access_token")
      return response
    }
  } catch {
    // Se erro ao decodificar token, remover e redirecionar
    const loginUrl = new URL("/login", request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete("access_token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.png$|.*\.jpg$|.*\.jpeg$|.*\.svg$).*)",
  ],
}
