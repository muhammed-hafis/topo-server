import { Request, Response } from "express";
import * as cmsService from "./cms.service";
import { sectionImageSchema } from "./cms.schema";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export const getSectionImages = async (req: Request, res: Response) => {
  try {
    const images = await cmsService.getAllImages();
    return res.status(200).json(images);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch images" });
  }
};

export const addSectionImage = async (req: Request, res: Response) => {
  try {
    const parsed = sectionImageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { image: "Image file is required" },
      });
    }

    const newImage = await cmsService.addImageService(parsed.data.section, req.file);
    return res.status(201).json({ message: "Image added successfully", data: newImage });
  } catch (error: any) {
    const statusCode = error.message?.includes("Cannot add more images") ? 409 : 500;
    return res.status(statusCode).json({ message: error.message || "Failed to add image" });
  }
};

export const updateSectionImage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!req.file) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { image: "Image file is required for update" },
      });
    }

    const updatedImage = await cmsService.updateImageService(id, req.file);
    return res.status(200).json({ message: "Image updated successfully", data: updatedImage });
  } catch (error: any) {
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({ message: error.message || "Failed to update image" });
  }
};

export const deleteSectionImage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid image ID format" });
    }

    await cmsService.deleteImageService(id);
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error: any) {
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({ message: error.message || "Failed to delete image" });
  }
};

export const getSectionImageBySection = async (req: Request, res: Response) => {
  try {
    const section = req.params.section as string;
    const images = await cmsService.getImageBySection(section);
    return res.status(200).json(images);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
