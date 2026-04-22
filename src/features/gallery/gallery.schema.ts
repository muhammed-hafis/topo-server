import { z } from "zod";

export const createGallerySchema = z.object({
  altText: z.string().min(1, "Alt text is required"),
});

export const updateGallerySchema = createGallerySchema.partial();
