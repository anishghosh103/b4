import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWebhook extends Document {
  name: string;
  uniqueId: string;
  path: string;
  userId: Types.ObjectId;
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
  },
  { timestamps: true }
);

export default mongoose.models.Webhook ||
  mongoose.model<IWebhook>('Webhook', WebhookSchema);
