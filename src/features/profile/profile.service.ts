import bcrypt from "bcryptjs";
import { updateAdminById, findAdminByIdRaw } from "./profile.repository";

export const updateProfile = async (adminId: string, data: { name: string; email?: string }) => {
  const updatedAdmin = await updateAdminById(adminId, data);
  if (!updatedAdmin) {
    throw new Error("Admin not found");
  }
  return updatedAdmin;
};

export const updatePassword = async (adminId: string, data: { currentPassword: string; newPassword: string }) => {
  const admin = await findAdminByIdRaw(adminId);
  if (!admin) {
    throw new Error("Admin not found");
  }

  const isPasswordMatch = await bcrypt.compare(data.currentPassword, admin.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid current password");
  }

  admin.password = data.newPassword;
  await admin.save();

  return { message: "Password updated successfully" };
};
