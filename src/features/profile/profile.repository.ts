import { Admin } from "../auth/admin.model";

export const updateAdminById = async (id: string, data: { name?: string; email?: string }) => {
  return await Admin.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

export const findAdminByIdRaw = async (id: string) => {
  return await Admin.findById(id);
};
