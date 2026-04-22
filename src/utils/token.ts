import jwt from "jsonwebtoken";

export const generateToken = (payload: object) => {
  const secret = process.env.JWT_SECRET || "default_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as any,
  });
};
