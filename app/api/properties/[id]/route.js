export const dynamic = 'force-dynamic'

import { getCollection } from '@/lib/mongodb'
import { ObjectId }      from 'mongodb'
import { NextResponse }  from 'next/server'

function toId(id) {
  try { return new ObjectId(id) } catch { return null }
}

export async function GET(_, { params }) {
  try {
    const _id = toId(params.id)
    if (!_id) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
    const col = await getCollection('properties')
    const doc = await col.findOne({ _id }, { projection: { bids: 0 } })
    if (!doc) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: doc })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const _id    = toId(params.id)
    if (!_id) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
    const userId = request.headers.get('x-user-id')
    const col    = await getCollection('properties')
    const body   = await request.json()
    delete body.ownerId; delete body.bids; delete body.trust; delete body._id
    const result = await col.findOneAndUpdate(
      { _id, ownerId: userId },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { bids: 0 } }
    )
    if (!result) return NextResponse.json({ success: false, message: 'Not found or unauthorized' }, { status: 404 })
    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const _id    = toId(params.id)
    if (!_id) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
    const userId = request.headers.get('x-user-id')
    const col    = await getCollection('properties')
    await col.updateOne({ _id, ownerId: userId }, { $set: { isActive: false } })
    return NextResponse.json({ success: true, message: 'Listing removed' })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
