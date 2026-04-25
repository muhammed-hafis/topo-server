import { Request, Response } from "express";
import * as testimonialService from "./testimonial.service";
import { createTestimonialSchema, updateTestimonialSchema } from "./testimonial.schema";
import { z } from "zod";

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const validatedData = createTestimonialSchema.parse(req.body);
    
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const newTestimonial = await testimonialService.createTestimonialService(validatedData, req.file);

    return res.status(201).json({
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to create testimonial" });
  }
};

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    return res.status(200).json(testimonials);
  } catch (error: any) {
    console.error("Error fetching testimonials:", error); 

    return res.status(500).json({
      message: "Failed to fetch testimonials", 
    });
  }
};

export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await testimonialService.getTestimonialById(id as string);
    return res.status(200).json(testimonial);
  } catch (error: any) {
    const status = error.message === "Testimonial not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch testimonial" });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateTestimonialSchema.parse(req.body);

    const updatedTestimonial = await testimonialService.updateTestimonialService(
      id as string,
      validatedData,
      req.file
    );

    return res.status(200).json({
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to update testimonial" });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await testimonialService.deleteTestimonialService(id as string);
    return res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    const status = error.message === "Testimonial not found" ? 404 : 400;
    return res.status(status).json({ message: error.message || "Failed to delete testimonial" });
  }
};
