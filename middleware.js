import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET || 'change-this-in-production')
const PROTECTED_PAGES = ['/post-property', '/dashboard']

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET())
    return payload
  } catch { return null }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('pb_token')?.value

  const isProtected = PROTECTED_PAGES.some(p => pathname.startsWith(p))
  if (isProtected) {
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    const payload = await verifyToken(token)
    if (!payload) {
      const url = new URL('/login', request.url)
      const res = NextResponse.redirect(url)
      res.cookies.set('pb_token', '', { maxAge: 0, path: '/' })
      return res
    }
    const headers = new Headers(request.headers)
    headers.set('x-user-id',    payload.userId)
    headers.set('x-user-phone', payload.phone)
    headers.set('x-user-role',  payload.role)
    return NextResponse.next({ request: { headers } })
  }

  if (pathname.startsWith('/api/properties') && request.method === 'POST') {
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
    const headers = new Headers(request.headers)
    headers.set('x-user-id', payload.userId)
    return NextResponse.next({ request: { headers } })
  }

  if (pathname.startsWith('/api/bids') && request.method === 'POST') {
    if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
    const headers = new Headers(request.headers)
    headers.set('x-user-id', payload.userId)
    return NextResponse.next({ request: { headers } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/post-property/:path*', '/dashboard/:path*', '/api/properties', '/api/bids'],
}
