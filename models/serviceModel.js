import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Service description is required']
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      enum: ['maintenance', 'repair', 'inspection', 'cleaning', 'other']
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required']
    },
    estimatedTime: {
      value: {
        type: Number,
        required: [true, 'Estimated time value is required']
      },
      unit: {
        type: String,
        enum: ['minutes', 'hours', 'days'],
        default: 'hours'
      }
    },
    image: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    compatibleVehicleTypes: [{
      type: String,
      enum: ['sedan', 'suv', 'truck', 'van', 'hatchback', 'convertible', 'other']
    }]
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service; 