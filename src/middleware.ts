// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Jika pengguna mencoba mengakses dashboard tanpa token, arahkan ke login
  if (pathname.startsWith('/Dashboard') && !token) {
    const url = new URL('/', request.url); // Asumsikan halaman login Anda ada di '/'
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Dashboard/:path*'],
};