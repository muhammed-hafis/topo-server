import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret_key";

export const generateAccessToken = (payload: object) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "15d";
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn as any });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

