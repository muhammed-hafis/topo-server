import { z } from "zod";

export const createFAQSchema = z.object({
  question: z.string({ 
    message: "Question is required"
  }).min(8, "Question must be at least 8 characters long"),
  answer: z.string({ 
    message: "Answer is required"
  }).min(3, "Answer must be at least 3 characters long"),
});

export const updateFAQSchema = createFAQSchema.partial();
