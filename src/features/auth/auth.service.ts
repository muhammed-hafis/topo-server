import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/token";
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

  const accessToken = generateToken({ email: user.email });

  return { accessToken };
};
