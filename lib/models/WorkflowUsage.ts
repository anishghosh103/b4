import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// TypeScript interface for the WorkflowUsage document
export interface IWorkflowUsage {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  month: string; // Format: "YYYY-MM" for monthly reset
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the WorkflowUsage document (includes Mongoose Document properties)
export interface IWorkflowUsageDocument extends IWorkflowUsage, Document {}

// Interface for the WorkflowUsage model
export interface IWorkflowUsageModel extends Model<IWorkflowUsageDocument> {}

const WorkflowUsageSchema = new Schema<IWorkflowUsageDocument, IWorkflowUsageModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index for userId + month
WorkflowUsageSchema.index({ userId: 1, month: 1 }, { unique: true });

// Prevent model recompilation during hot-reload in development
const WorkflowUsage: IWorkflowUsageModel =
  (mongoose.models.WorkflowUsage as IWorkflowUsageModel) ||
  mongoose.model<IWorkflowUsageDocument, IWorkflowUsageModel>(
    'WorkflowUsage',
    WorkflowUsageSchema
  );

export default WorkflowUsage;
