import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    salt: {
      type: String,
      select: false
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    profileImage: {
      type: String,
      default: 'default.jpg'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      code: String,
      expiresAt: Date
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User; 