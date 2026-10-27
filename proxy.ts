import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
export async function proxy(request: NextRequest) {
  const token = request.cookies.get('aura_session')?.value;
  const secret = process.env.JWT_SECRET;
  let role: string | null = null;
  if (token && secret) {
    try { const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] }); if (typeof payload.id === 'string' && typeof payload.exp === 'number' && (payload.role === 'user' || payload.role === 'admin')) role = payload.role; } catch { /* Cookie inválida: se trata como invitado. */ }
  }
  const pathname = request.nextUrl.pathname;
  const privateRoute = pathname.startsWith('/admin') || pathname.startsWith('/mis-solicitudes');
  let response: NextResponse;
  if (privateRoute && !role) response = NextResponse.redirect(new URL('/login', request.url));
  else if (pathname.startsWith('/admin') && role !== 'admin') response = NextResponse.redirect(new URL('/', request.url));
  else if ((pathname === '/login' || pathname === '/registro') && role) response = NextResponse.redirect(new URL('/', request.url));
  else response = NextResponse.next();
  if (token && !role) response.cookies.delete('aura_session');
  return response;
}
export const config = { matcher: ['/admin/:path*', '/mis-solicitudes/:path*', '/login', '/registro'] };
