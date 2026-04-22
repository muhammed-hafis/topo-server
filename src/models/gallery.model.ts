import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  imageUrl: string;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>("Gallery", GallerySchema);
