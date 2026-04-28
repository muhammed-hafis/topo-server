import { z } from "zod";

const isValidUrl = (val: string) => {
  try { new URL(val); return true; } catch { return false; }
};

export const createReelSchema = z.object({
  link: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed && !trimmed.startsWith("http")) {
        return `https://${trimmed}`;
      }
      return trimmed;
    }
    return val;
  }, z.string().url("Please enter a valid URL (e.g. https://instagram.com/reel/...)")),
});

export const updateReelSchema = createReelSchema.partial();
