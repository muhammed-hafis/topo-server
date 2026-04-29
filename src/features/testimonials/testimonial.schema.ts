import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  rating: z
    .coerce.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters long")
    .max(200, "Review cannot exceed 200 characters"),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
