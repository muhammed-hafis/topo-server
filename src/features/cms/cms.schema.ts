import { z } from "zod";

export const sectionImageSchema = z.object({
  section: z.enum(["hero", "about", "why-choose", "cta"]),
});

