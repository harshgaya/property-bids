export const dynamic = 'force-dynamic'
import { clearAuthCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out' })
  return clearAuthCookie(res)
}
