import { Request, Response } from "express";
import { z } from "zod";
import { authenticate, refreshAccessToken } from "./auth.service";
import { loginSchema } from "./auth.schema";

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    const { accessToken, refreshToken } = await authenticate(
      parsed.data.email,
      parsed.data.password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: "Login successful", accessToken });
  } catch (error: any) {
    return res.status(401).json({ message: error.message || "Invalid credentials" });
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

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
