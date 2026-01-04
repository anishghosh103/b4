import mongoose, { Document, Schema, Types } from 'mongoose';
import { Platform } from '../platforms/types';

export interface IEvent extends Document {
  user: Types.ObjectId;
  webhook: Types.ObjectId;
  name: string;
  platform: Platform;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  headers: any;
  queryParams: any;
  cliResponse: {
    status: number;
    body: any;
  };
  urlResponse: {
    status: number;
    body: any;
  };
  overQuota: boolean; // True if event was received during grace period
  verified: boolean;
  normalizedPayload: any;
  verificationError: string | null;
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
      enum: [
        'stripe',
        'docusign',
        'dodo',
        'polar',
        'pandadoc',
        'documenso',
        'custom',
      ],
      default: 'custom',
    },
    method: {
      type: String,
      enum: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    },
    payload: { type: Schema.Types.Mixed },
    headers: { type: Schema.Types.Mixed },
    queryParams: { type: Schema.Types.Mixed },
    cliResponse: {
      status: Number,
      body: Schema.Types.Mixed,
    },
    urlResponse: {
      status: Number,
      body: Schema.Types.Mixed,
    },
    overQuota: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    normalizedPayload: { type: Schema.Types.Mixed, default: null },
    verificationError: { type: String, default: null },
  },
  { timestamps: true }
);

// Indexes for efficient queries
EventSchema.index({ webhook: 1, createdAt: -1 }); // Event history lookup
EventSchema.index({ webhook: 1, overQuota: 1, createdAt: -1 }); // Grace period queries

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
