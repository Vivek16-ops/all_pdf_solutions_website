import mongoose, { Document, Schema } from 'mongoose';

export interface IUserService extends Document {
  username: string;
  service: string;
  subscription: {
    taken: boolean;
    plan?: string; // e.g. 'pro', 'enterprise', etc.
    startedAt?: Date;
    expiresAt?: Date;
  };
  freeIterations?: number; // Only present if subscription.taken === false
}

const UserServiceSchema = new Schema<IUserService>({
  username: { type: String, required: true },
  service: { type: String, required: true },
  subscription: {
    taken: { type: Boolean, required: true },
    plan: { type: String },
    startedAt: { type: Date },
    expiresAt: { type: Date },
  },
  freeIterations: { type: Number, default: 5 }, // Default 5 free iterations
});

export default mongoose.models.UserService || mongoose.model<IUserService>('UserService', UserServiceSchema);
