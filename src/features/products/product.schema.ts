import { z } from "zod";

export const createProductSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(60, "Product name must be 60 characters or less")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Only letters, numbers, spaces and hyphens allowed")
    .trim(),

  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be 200 characters or less")
    .trim(),
});

export const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided to update" }
);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
