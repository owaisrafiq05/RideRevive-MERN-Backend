import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
          required: true
        },
        serviceName: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        serviceDetails: {
          type: mongoose.Schema.Types.Mixed,
          description: 'Form-specific details for the service'
        }
      }
    ],
    address: {
      fullAddress: {
        type: String,
        required: true
      },
      coordinates: {
        lng: Number,
        lat: Number
      }
    },
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'in-progress',
        'completed',
        'cancelled',
        'rejected'
      ],
      default: 'pending'
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'online_wallet'],
      default: 'credit_card'
    },
    paymentDetails: {
      transactionId: String,
      paymentDate: Date
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    specialInstructions: {
      type: String
    },
    technicianNotes: {
      type: String
    },
    adminNotes: {
      type: String
    },
    isReviewed: {
      type: Boolean,
      default: false
    },
    contactName: {
      type: String
    },
    contactPhone: {
      type: String
    },
    isEmergency: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order; 