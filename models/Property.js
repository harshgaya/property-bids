import mongoose from 'mongoose'

const PhotoSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  isLive:    { type: Boolean, default: false },
  lat:       Number,
  lng:       Number,
  timestamp: Date,
})

const BidSchema = new mongoose.Schema({
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:   { type: Number, default: 99 },
  status:   { type: String, enum: ['pending', 'accepted', 'ignored'], default: 'pending' },
}, { timestamps: true })

const PropertySchema = new mongoose.Schema({
  type:      { type: String, enum: ['villa','apartment','highrise','house','plot','land'], required: true, index: true },
  title:     { type: String, required: true },
  description: String,
  price:     { type: Number, required: true, index: true },
  priceLabel: String,
  trust:     { type: String, enum: ['basic','manual','legal'], default: 'basic', index: true },
  facing:    { type: String, enum: ['East','West','North','South'], index: true },
  tags:      [{ type: String, index: true }],
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  address: {
    area:    String,
    city:    { type: String, index: true },
    state:   String,
    pincode: String,
  },
  fields: {
    bhk: Number, sft: Number, sqYards: Number, uds: Number,
    floors: Number, floor: Number, lift: Boolean,
    noOfLifts: Number, amenities: [String],
    lrsPaid: Boolean, roadAccess: Number,
    acres: Number, plotType: String, landType: String,
  },
  photos:     [PhotoSchema],
  bids:       [BidSchema],
  ownerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isActive:   { type: Boolean, default: true, index: true },
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
}, { timestamps: true })

PropertySchema.index({ location: '2dsphere' })
PropertySchema.index({ type: 1, price: 1, trust: 1 })
PropertySchema.index({ type: 1, 'address.city': 1, isActive: 1 })

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema)
export default Property
