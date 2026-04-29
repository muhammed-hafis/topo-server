import { Request, Response } from "express";
import * as testimonialService from "./testimonial.service";
import { createTestimonialSchema, updateTestimonialSchema } from "./testimonial.schema";
import { z } from "zod";

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const parsed = createTestimonialSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { avatar: "Profile image is required" },
      });
    }

    const newTestimonial = await testimonialService.createTestimonialService(parsed.data, req.file);

    return res.status(201).json({
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create testimonial" });
  }
};

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const result = await testimonialService.getAllTestimonials(page, limit);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const testimonial = await testimonialService.getTestimonialById(id);
    return res.status(200).json(testimonial);
  } catch (error: any) {
    const status = error.message === "Testimonial not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch testimonial" });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateTestimonialSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    const updatedTestimonial = await testimonialService.updateTestimonialService(id, parsed.data, req.file);

    return res.status(200).json({
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error: any) {
    const status = error.message === "Testimonial not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to update testimonial" });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await testimonialService.deleteTestimonialService(id);
    return res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    const status = error.message === "Testimonial not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to delete testimonial" });
  }
};
