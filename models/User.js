import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  phone:         { type: String, required: true, unique: true, index: true },
  name:          String,
  email:         { type: String, sparse: true },
  avatar:        String,
  role:          { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked:     { type: Boolean, default: false },
  otp:           String,
  otpExpiry:     Date,
  totalBids:     { type: Number, default: 0 },
  totalListings: { type: Number, default: 0 },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User
