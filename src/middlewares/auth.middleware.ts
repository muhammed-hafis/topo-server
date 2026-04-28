import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";
import { Admin } from "../features/auth/admin.model";

export interface AuthRequest extends Request {
  admin?: any;
}

export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyAccessToken(token);

    const admin = await Admin.findOne({ email: decoded.email }).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
