import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// TypeScript interface for the PricingConfig document
export interface IPricingConfig {
  _id: Types.ObjectId;
  tier: 'free' | 'pro';
  name: string; // "Pro"
  amount: {
    value: number;
    currency: string;
  };
  dodoProductId: string;
  environment?: 'test_mode' | 'live_mode';
  isActive: boolean; // Enable/disable
  metadata: Record<string, any>; // Flexible additional data
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the PricingConfig document (includes Mongoose Document properties)
export interface IPricingConfigDocument extends IPricingConfig, Document {}

// Interface for the PricingConfig model
export interface IPricingConfigModel extends Model<IPricingConfigDocument> {
  // Static method to get active pricing for a specific type
  getActivePricing(type: string): Promise<IPricingConfigDocument[]>;
}

const PricingConfigSchema = new Schema<
  IPricingConfigDocument,
  IPricingConfigModel
>(
  {
    tier: {
      type: String,
      required: [true, 'Tier is required'],
      enum: {
        values: ['free', 'pro'],
        message: 'Tier must be either free or pro',
      },
      index: true, // For filtering by type
    },
    environment: {
      type: String,
      enum: {
        values: ['test_mode', 'live_mode'],
        message: 'Tier must be either test_mode or live_mode',
      },
      index: true, // For filtering by type
    },
    name: {
      type: String,
      required: [true, 'Pricing name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    amount: {
      value: {
        type: Number,
        required: [true, 'Amount value is required'],
        min: [0, 'Amount value cannot be negative'],
      },
      currency: {
        type: String,
        required: [true, 'Currency is required'],
      },
    },
    dodoProductId: {
      type: String,
      required: [true, 'Dodo Payments Product ID is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // For filtering active pricing
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
      // Flexible field for additional data
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
PricingConfigSchema.index({ environment: 1, isActive: 1 }); // Filter active pricing by environment

// Prevent model recompilation during hot-reload in development
const PricingConfig: IPricingConfigModel =
  (mongoose.models.PricingConfig as IPricingConfigModel) ||
  mongoose.model<IPricingConfigDocument, IPricingConfigModel>(
    'PricingConfig',
    PricingConfigSchema
  );

export default PricingConfig;
