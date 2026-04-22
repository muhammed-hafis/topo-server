import { Request, Response } from "express";
import { z } from "zod";
import { authenticate, refreshAccessToken } from "./auth.service";
import { loginSchema } from "./auth.schema";

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { accessToken, refreshToken } = await authenticate(
      validatedData.email,
      validatedData.password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
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

export const handleRefresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const { accessToken } = await refreshAccessToken(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    return res.status(401).json({ message: error.message || "Unauthorized" });
  }
};
