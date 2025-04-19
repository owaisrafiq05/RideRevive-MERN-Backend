import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: [
        'order_status_change',
        'payment_confirmation',
        'service_reminder',
        'review_request',
        'admin_message',
        'system_alert'
      ],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    reference: {
      model: {
        type: String,
        enum: ['Order', 'Review', 'User', 'Car', 'Service']
      },
      id: {
        type: mongoose.Schema.Types.ObjectId
      }
    },
    additionalData: {
      type: mongoose.Schema.Types.Mixed
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index to improve query performance by recipient and read status
notificationSchema.index({ recipient: 1, isRead: 1 });
// TTL index to automatically delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 