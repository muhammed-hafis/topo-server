import { z } from "zod";

export const createReelSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(10, "Title cannot exceed 10 characters"),
  link: z
    .string()
    .trim()
    .min(3, "Video link must be at least 3 characters long")
    .refine(
      (val) => val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
      {
        message: "Please provide a valid link (starting with '/' for local files or 'http/https' for external videos)",
      }
    ),
});

export const updateReelSchema = createReelSchema.partial();
