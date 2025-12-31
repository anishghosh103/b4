import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  project: Types.ObjectId;
  name: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  headers: any;
  responseStatus: number;
  responseBody: any;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    project: {
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
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
