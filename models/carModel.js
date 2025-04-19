import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: truxe
    },
    make: {
      type: String,
      required: [true, 'Car make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Car year is required']
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'other'],
      default: 'petrol'
    },
    transmission: {
      type: String,
      enum: ['automatic', 'manual', 'other'],
      default: 'manual'
    },
    mileage: {
      type: Number
    },
    vin: { // Vehicle Identification Number
      type: String,
      trim: true
    },
  },
  {
    timestamps: true
  }
);

const Car = mongoose.model('Car', carSchema);

export default Car; 