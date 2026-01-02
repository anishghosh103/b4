import mongoose, { Document, Schema, Types } from 'mongoose';

export type Platform = 'stripe' | 'github' | 'docusign' | 'dodo' | 'unknown';

export interface IEvent extends Document {
  user: Types.ObjectId;
  webhook: Types.ObjectId;
  name: string;
  platform: Platform;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  headers: any;
  queryParams: any;
  responseStatus: number;
  responseBody: any;
  overQuota: boolean; // True if event was received during grace period
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    webhook: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Webhook',
    },
    name: {
      type: String,
    },
    platform: {
      type: String,
      enum: ['stripe', 'github', 'docusign', 'dodo', 'unknown'],
      default: 'unknown',
    },
    method: {
      type: String,
      enum: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    },
    payload: { type: Schema.Types.Mixed },
    headers: { type: Schema.Types.Mixed },
    queryParams: { type: Schema.Types.Mixed },
    responseStatus: { type: Number },
    responseBody: { type: Schema.Types.Mixed },
    overQuota: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for efficient queries
EventSchema.index({ webhook: 1, createdAt: -1 }); // Event history lookup
EventSchema.index({ webhook: 1, overQuota: 1, createdAt: -1 }); // Grace period queries

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
