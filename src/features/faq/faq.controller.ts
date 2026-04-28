import { Request, Response } from "express";
import * as faqService from "./faq.service";
import { createFAQSchema, updateFAQSchema } from "./faq.schema";
import { z } from "zod";

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const parsed = createFAQSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    const newFAQ = await faqService.addFAQService(parsed.data);
    return res.status(201).json({ message: "FAQ created successfully", data: newFAQ });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create FAQ" });
  }
};

export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await faqService.getAllFAQs();
    return res.status(200).json(faqs);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch FAQs" });
  }
};

export const getFAQById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const faq = await faqService.getFAQById(id);
    return res.status(200).json(faq);
  } catch (error: any) {
    const status = error.message === "FAQ not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch FAQ" });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateFAQSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    const updatedFAQ = await faqService.updateFAQService(id, parsed.data);
    return res.status(200).json({ message: "FAQ updated successfully", data: updatedFAQ });
  } catch (error: any) {
    const status = error.message === "FAQ not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to update FAQ" });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await faqService.deleteFAQService(id);
    return res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error: any) {
    const status = error.message === "FAQ not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to delete FAQ" });
  }
};
