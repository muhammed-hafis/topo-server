import { z } from "zod";

export const createFAQSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const updateFAQSchema = createFAQSchema.partial();
