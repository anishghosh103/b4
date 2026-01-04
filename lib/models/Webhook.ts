import mongoose, { Document, Schema, Types } from 'mongoose';
import { Platform } from '../platforms/types';

export interface IWebhook extends Document {
  name: string;
  uniqueId: string;
  path: string;
  userId: Types.ObjectId;
  type: Platform;
  destinationUrl: string | null;
  cliEnabled: boolean;
  signingSecret: string | null;
  createdAt: Date;
}

const WebhookSchema = new Schema<IWebhook>(
  {
    name: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      enum: [
        'custom',
        'stripe',
        'dodo',
        'polar',
        'pandadoc',
        'docusign',
        'documenso',
      ],
      default: 'custom',
    },
    destinationUrl: {
      type: String,
      default: null,
    },
    cliEnabled: {
      type: Boolean,
      default: true,
    },
    signingSecret: {
      type: String,
      default: null,
      select: false, // Don't include by default in queries
    },
  },
  { timestamps: true }
);

export default mongoose.models.Webhook ||
  mongoose.model<IWebhook>('Webhook', WebhookSchema);
