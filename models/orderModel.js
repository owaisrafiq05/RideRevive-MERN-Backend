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
        price: {
          type: Number,
          required: true
        }
      }
    ],
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
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order; 