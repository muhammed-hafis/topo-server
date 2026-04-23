import mongoose, { Schema, Document } from "mongoose";

export interface IReel extends Document {
  title: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReelSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReel>("Reel", ReelSchema);
