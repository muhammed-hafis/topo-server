import { Request, Response } from "express";
import * as galleryService from "./gallery.service";
import { createGallerySchema, updateGallerySchema } from "./gallery.schema";
import { z } from "zod";

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const validatedData = createGallerySchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Gallery image is required" });
    }

    const newItem = await galleryService.addGalleryService(validatedData, req.file);

    return res.status(201).json({
      message: "Gallery item created successfully",
      data: newItem,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to create gallery item" });
  }
};

export const getAllGalleryItems = async (req: Request, res: Response) => {
  try {
    const items = await galleryService.getAllGalleryItems();
    return res.status(200).json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch gallery items" });
  }
};

export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await galleryService.getGalleryById(id as string);
    return res.status(200).json(item);
  } catch (error: any) {
    const status = error.message === "Gallery item not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch gallery item" });
  }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateGallerySchema.parse(req.body);

    const updatedItem = await galleryService.updateGalleryService(
      id as string,
      validatedData,
      req.file
    );

    return res.status(200).json({
      message: "Gallery item updated successfully",
      data: updatedItem,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to update gallery item" });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await galleryService.deleteGalleryService(id as string);
    return res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to delete gallery item" });
  }
};
