import { z } from "zod";

export const createFAQSchema = z.object({
  question: z.string({ 
    message: "Question is required"
  }).min(1, "Question is required"),
  answer: z.string({ 
    message: "Answer is required"
  }).min(1, "Answer is required"),
});

export const updateFAQSchema = createFAQSchema.partial();
