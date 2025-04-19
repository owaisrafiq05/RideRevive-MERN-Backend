import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true
    },
    serviceQuality: {
      type: Number,
      min: 1,
      max: 5
    },
    customerService: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    },
    images: [{
      type: String
    }],
    responseFromAdmin: {
      comment: String,
      date: Date
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate reviews for the same order
reviewSchema.index({ user: 1, order: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review; 