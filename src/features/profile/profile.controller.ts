import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../utils/auth.middleware";
import { updateProfileSchema, updatePasswordSchema } from "./profile.schema";
import { updateProfile, updatePassword } from "./profile.service";

export const handleUpdateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const adminId = req.admin._id;

    const updatedAdmin = await updateProfile(adminId, validatedData);

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedAdmin,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const handleUpdatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updatePasswordSchema.parse(req.body);
    const adminId = req.admin._id;

    const result = await updatePassword(adminId, validatedData);

    return res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }

    if (error.message === "Invalid current password") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
