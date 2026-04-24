import { Request, Response } from "express";
import * as cmsService from "./cms.service";
import { sectionImageSchema } from "./cms.schema";
import { z } from "zod";

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
    const validatedData = sectionImageSchema.parse(req.body);
    const { section } = validatedData;



    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const newImage = await cmsService.addImageService(
      section,
      req.file
    );


    return res.status(201).json({
      message: `${section} image added successfully`,
      data: newImage,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message, errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to add image" });
  }
};

export const updateSectionImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Partial update allowed

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required for update" });
    }

    const updatedImage = await cmsService.updateImageService(
      id as string,
      req.file
    );



    return res.status(200).json({
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to update image" });
  }
};

export const deleteSectionImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await cmsService.deleteImageService(id as string);
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to delete image" });
  }
};
export const getSectionImageBySection = async (req: Request, res: Response) => {
  try {
    const { section } = req.params;

    const images = await cmsService.getImageBySection(section as string);

    return res.status(200).json(images);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
