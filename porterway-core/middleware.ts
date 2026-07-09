import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtenemos la cookie o el flag de sesión que definiste en tu Login
  // Nota: Usaremos un nombre de cookie estándar para el middleware
  const session = request.cookies.get('porterway_session');

  // Definimos las rutas que están protegidas
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/rankings') || request.nextUrl.pathname.startsWith('/new-order') || request.nextUrl.pathname.startsWith('/new-user');

  // Si intenta entrar a una ruta protegida y no hay sesión, al login
  if (isDashboardRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si ya está logueado y trata de ir al login, lo mandamos al dashboard
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configuración para que el middleware sepa qué rutas vigilar
export const config = {
  matcher: ['/dashboard/:path*', '/rankings/:path*', '/new-order/:path*', '/new-user/:path*', '/login'],
};