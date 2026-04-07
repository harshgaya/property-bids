export const dynamic = 'force-dynamic'
import { getCollection } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { phone } = await request.json()
    if (!phone || !/^[6-9]\d{9}$/.test(phone))
      return NextResponse.json({ success: false, message: 'Valid 10-digit Indian number required' }, { status: 400 })

    const otp      = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry= new Date(Date.now() + 10 * 60 * 1000)
    const col      = await getCollection('users')

    await col.updateOne(
      { phone },
      { $set: { phone, otp, otpExpiry, updatedAt: new Date() }, $setOnInsert: { role: 'user', createdAt: new Date(), totalBids: 0, totalListings: 0 } },
      { upsert: true }
    )

    // TODO: await sendSMS(phone, `Your PropertyBids OTP: ${otp}. Valid 10 mins.`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent',
      ...(process.env.NODE_ENV === 'development' && { otp }),
    })
  } catch (e) {
    console.error('[send-otp]', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
