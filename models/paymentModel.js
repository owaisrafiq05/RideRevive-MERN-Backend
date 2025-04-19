import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'online_wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: {
      type: String
    },
    paymentProvider: {
      type: String,
      enum: ['stripe', 'paypal', 'cash', 'bank', 'other']
    },
    paymentDetails: {
      cardLastFour: String,
      cardType: String,
      receiptUrl: String,
      authorizationCode: String
    },
    refundDetails: {
      refundId: String,
      refundAmount: Number,
      refundDate: Date,
      refundReason: String
    },
    notes: {
      type: String
    },
    billingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; 