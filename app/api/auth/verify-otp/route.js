export const dynamic = 'force-dynamic'
import { getCollection } from '@/lib/mongodb'
import { signToken, setAuthCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { phone, otp } = await request.json()
    if (!phone || !otp) return NextResponse.json({ success: false, message: 'Phone and OTP required' }, { status: 400 })

    const col  = await getCollection('users')
    const user = await col.findOne({ phone })
    if (!user || user.otp !== otp)  return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 })
    if (new Date() > user.otpExpiry) return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 401 })

    await col.updateOne({ phone }, { $unset: { otp: '', otpExpiry: '' } })

    const token = await signToken({ userId: user._id.toString(), phone, role: user.role })
    const res   = NextResponse.json({ success: true, user: { _id: user._id, phone, name: user.name, role: user.role } })
    return setAuthCookie(res, token)
  } catch (e) {
    console.error('[verify-otp]', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
