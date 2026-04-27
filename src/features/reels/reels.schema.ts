import { z } from "zod";

const isValidUrl = (val: string) => {
  try { new URL(val); return true; } catch { return false; }
};

export const createReelSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  link: z
    .string()
    .trim()
    .min(1, "Video link is required")
    .refine(isValidUrl, "Please enter a valid URL (e.g. https://instagram.com/reel/...)"),
});

export const updateReelSchema = createReelSchema.partial();
