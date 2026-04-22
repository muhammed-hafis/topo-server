import { z } from "zod";

export const sectionImageSchema = z.object({
  section: z.enum(["hero", "about", "why-choose", "cta"]),
  title: z.string().min(1, "Title is required"),
  altText: z.string().min(1, "Alt text is required"),
});
