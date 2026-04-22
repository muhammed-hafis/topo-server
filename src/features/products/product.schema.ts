import { z } from "zod";

export const createProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  altText: z.string().min(1, "Alt text is required"),
});

export const updateProductSchema = createProductSchema.partial();
