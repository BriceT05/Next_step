import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get('admin_auth')?.value
  const expected = process.env.ADMIN_TOKEN ?? ''

  // Premier filtre : le cookie vaut « ADMIN_TOKEN.version ». La version (déconnexion après un changement
  // de mot de passe) est vérifiée côté serveur, dans chaque action admin et dans /api/upload.
  if (!token || !expected || !token.startsWith(`${expected}.`)) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
