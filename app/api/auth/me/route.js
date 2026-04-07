export const dynamic = 'force-dynamic'

import { verifyToken }  from '@/lib/auth'
import { getCollection } from '@/lib/mongodb'
import { ObjectId }     from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const token = request.cookies.get('pb_token')?.value
    if (!token) return NextResponse.json({ success: false }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload?.userId) return NextResponse.json({ success: false }, { status: 401 })

    const col  = await getCollection('users')
    const user = await col.findOne(
      { _id: new ObjectId(String(payload.userId)) },
      { projection: { otp: 0, otpExpiry: 0 } }
    )
    if (!user) return NextResponse.json({ success: false }, { status: 404 })

    return NextResponse.json({ success: true, user })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
