import { Request, Response } from "express";
import * as galleryService from "./gallery.service";
import { z } from "zod";

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { image: "Gallery image is required" },
      });
    }

    const newItem = await galleryService.addGalleryService({}, req.file);

    return res.status(201).json({
      message: "Gallery item created successfully",
      data: newItem,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create gallery item" });
  }
};

export const getAllGalleryImages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const items = await galleryService.getAllGalleryImages(page, limit);
    return res.status(200).json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch gallery images" });
  }
};

export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const item = await galleryService.getGalleryById(id);
    return res.status(200).json(item);
  } catch (error: any) {
    const status = error.message === "Gallery item not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch gallery item" });
  }
};

export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const updatedItem = await galleryService.updateGalleryService(id, {}, req.file);

    return res.status(200).json({
      message: "Gallery item updated successfully",
      data: updatedItem,
    });
  } catch (error: any) {
    const status = error.message === "Gallery item not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to update gallery item" });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await galleryService.deleteGalleryService(id);
    return res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error: any) {
    const status = error.message === "Gallery item not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to delete gallery item" });
  }
};
