import { Request, Response } from "express";
import { z } from "zod";
import { authenticate } from "./auth.service";
import { loginSchema } from "./auth.schema";

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await authenticate(
      validatedData.email,
      validatedData.password
    );

    return res.status(200).json({
      message: "Login successful",
      data: result,
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

    return res.status(401).json({
      message: error.message || "Internal server error",
    });
  }
};
