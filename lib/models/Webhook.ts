import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhook extends Document {
  name: string;
  uniqueId: string;
  path: string;
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
  },
  { timestamps: true }
);

export default mongoose.models.Webhook ||
  mongoose.model<IWebhook>('Webhook', WebhookSchema);
