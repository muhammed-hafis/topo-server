import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token";
import { findAdminByEmail } from "./auth.repository";

export const authenticate = async (email: string, password: string) => {
  const user = await findAdminByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken({ email: user.email,id:user._id });
  const refreshToken = generateRefreshToken({ email: user.email,id:user._id });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
  try {
    const decoded: any = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ email: decoded.email,id:decoded.id });
    return { accessToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
