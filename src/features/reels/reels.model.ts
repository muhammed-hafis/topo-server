import mongoose, { Schema, Document } from "mongoose";

export interface IReel extends Document {
  thumbnail: string;
  publicId: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReelSchema: Schema = new Schema(
  {
    thumbnail: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
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
