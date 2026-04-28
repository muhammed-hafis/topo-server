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
    const validatedData = createFAQSchema.parse(req.body);
    const newFAQ = await faqService.addFAQService(validatedData);

    return res.status(201).json({
      message: "FAQ created successfully",
      data: newFAQ,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message, errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to create FAQ" });
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
    const { id } = req.params;
    const faq = await faqService.getFAQById(id as string);
    return res.status(200).json(faq);
  } catch (error: any) {
    const status = error.message === "FAQ not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch FAQ" });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateFAQSchema.parse(req.body);

    const updatedFAQ = await faqService.updateFAQService(id as string, validatedData);

    return res.status(200).json({
      message: "FAQ updated successfully",
      data: updatedFAQ,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message, errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to update FAQ" });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await faqService.deleteFAQService(id as string);
    return res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to delete FAQ" });
  }
};
