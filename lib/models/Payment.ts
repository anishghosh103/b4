import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// TypeScript interface for the Payment document
export interface IPayment {
  _id: Types.ObjectId;
  user: Types.ObjectId | null;
  status: 'pending' | 'failed' | 'completed';
  tier: string;
  dodoPaymentId?: string; // Dodo checkout session ID
  dodoSubscriptionId?: string;
  amount?: {
    value: number;
    currency: string;
  };
  // Billing cycle tracking
  currentPeriodStart?: Date; // Start of current billing period
  currentPeriodEnd?: Date; // End of current billing period (next billing date)
  cancelAtPeriodEnd?: boolean; // If cancellation is scheduled
  cancelledAt?: Date; // When subscription was cancelled
  webhookVerified?: boolean; // Track webhook processing
  metadata?: Record<string, any>; // Additional Dodo payment details
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the Payment document (includes Mongoose Document properties)
export interface IPaymentDocument extends IPayment, Document {}

// Interface for the Payment model
export interface IPaymentModel extends Model<IPaymentDocument> {
  // Static method to get user payment history
  getUserPaymentHistory(
    userId: Types.ObjectId,
    limit?: number
  ): Promise<IPaymentDocument[]>;
  // Static method to update payment status
  updatePaymentStatus(
    paymentId: Types.ObjectId,
    status: string
  ): Promise<IPaymentDocument | null>;
}

const PaymentSchema = new Schema<IPaymentDocument, IPaymentModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Nullable for guest users
      index: true, // For user payment history
    },
    tier: {
      type: String,
      required: [true, 'Tier is required'],
      enum: {
        values: ['free', 'pro'],
        message: 'Tier must be either free or pro',
      },
      index: true, // For filtering by payment type
    },
    status: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: {
        values: ['pending', 'failed', 'completed'],
        message: 'Status must be one of: pending, failed, completed',
      },
      default: 'pending',
      index: true, // For status filtering
    },
    dodoPaymentId: {
      type: String,
      sparse: true, // Sparse unique index - allows nulls/missing values
      unique: true, // Ensures uniqueness for idempotency
      trim: true,
    },
    dodoSubscriptionId: {
      type: String,
      trim: true,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
    amount: {
      value: {
        type: Number,
        min: [0, 'Amount cannot be negative'],
      },
      currency: {
        type: String,
        required: [true, 'Currency is required'],
      },
    },
    webhookVerified: {
      type: Boolean,
      default: false,
      index: true, // For finding unverified payments
    },
    metadata: {
      type: Schema.Types.Mixed, // Flexible object for additional data
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
PaymentSchema.index({ user: 1, status: 1 }); // User payment history with status filter
PaymentSchema.index({ status: 1, createdAt: -1 }); // Pending/failed payments
PaymentSchema.index({ tier: 1, status: 1 }); // Tier analytics
PaymentSchema.index({ user: 1, status: 1, tier: 1 }); // User payment queries with filters

// Static method: Get user payment history
PaymentSchema.statics.getUserPaymentHistory = function (
  userId: Types.ObjectId,
  limit: number = 50
) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('imageGenerationId');
};

// Static method: Update payment status
PaymentSchema.statics.updatePaymentStatus = function (
  paymentId: Types.ObjectId,
  status: string
) {
  return this.findByIdAndUpdate(
    paymentId,
    { status },
    { new: true, runValidators: true }
  );
};

// Prevent model recompilation during hot-reload in development
const Payment: IPaymentModel =
  (mongoose.models.Payment as IPaymentModel) ||
  mongoose.model<IPaymentDocument, IPaymentModel>('Payment', PaymentSchema);

export default Payment;
