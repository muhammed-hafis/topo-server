import mongoose, { Schema, Document } from "mongoose";

export interface ISectionImage extends Document {
  section: "hero" | "about" | "why-choose" | "cta";
  imageUrl: string;
  publicId: string;
  title?: string;
  altText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SectionImageSchema: Schema = new Schema(
  {
    section: {
      type: String,
      required: true,
      enum: ["hero", "about", "why-choose", "cta"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    altText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISectionImage>("SectionImage", SectionImageSchema);
