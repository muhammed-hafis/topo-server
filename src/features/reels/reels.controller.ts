import { Request, Response } from "express";
import * as reelsService from "./reels.service";
import { createReelSchema, updateReelSchema } from "./reels.schema";
import { z } from "zod";

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export const createReel = async (req: Request, res: Response) => {
  try {
    const validatedData = createReelSchema.parse(req.body);
    const newReel = await reelsService.addReelService(validatedData);
    return res.status(201).json({
      message: "Reel created successfully",
      data: newReel,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: formatZodErrors(error) });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "This video link already exists" });
    }
    return res.status(400).json({ message: error.message || "Failed to create reel" });
  }
};

export const getAllReels = async (req: Request, res: Response) => {
  try {
    const reels = await reelsService.getAllReels();
    return res.status(200).json(reels);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch reels" });
  }
};

export const getReelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reel = await reelsService.getReelById(id as string);
    return res.status(200).json(reel);
  } catch (error: any) {
    const status = error.message === "Reel not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch reel" });
  }
};

export const updateReel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateReelSchema.parse(req.body);
    const updatedReel = await reelsService.updateReelService(id as string, validatedData);
    return res.status(200).json({
      message: "Reel updated successfully",
      data: updatedReel,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: formatZodErrors(error) });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "This video link already exists" });
    }
    return res.status(400).json({ message: error.message || "Failed to update reel" });
  }
};

export const deleteReel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await reelsService.deleteReelService(id as string);
    return res.status(200).json({ message: "Reel deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to delete reel" });
  }
};
