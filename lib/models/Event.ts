import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  webhook: Types.ObjectId;
  name: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  headers: any;
  queryParams: any;
  responseStatus: number;
  responseBody: any;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    webhook: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Webhook',
    },
    name: {
      type: String,
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
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
