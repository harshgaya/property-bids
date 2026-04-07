export const dynamic = 'force-dynamic'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { propertyId } = await request.json()
    if (!propertyId) return NextResponse.json({ success: false, message: 'propertyId required' }, { status: 400 })

    const col      = await getCollection('properties')
    const property = await col.findOne({ _id: new ObjectId(propertyId), isActive: true })
    if (!property) return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 })
    if (property.ownerId === userId) return NextResponse.json({ success: false, message: 'Cannot bid on your own listing' }, { status: 403 })

    const alreadyBid = (property.bids || []).some(b => b.bidderId === userId && b.status !== 'ignored')
    if (alreadyBid) return NextResponse.json({ success: false, message: 'Already placed a bid' }, { status: 409 })

    // TODO: Create Razorpay order — write bid only after webhook confirms
    // const order = await razorpay.orders.create({ amount: 9900, currency: 'INR', receipt: `bid_${propertyId}_${userId}` })

    return NextResponse.json({ success: true, message: 'Payment initiated', amount: 99, propertyId })
  } catch (e) {
    console.error('[POST /api/bids]', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
