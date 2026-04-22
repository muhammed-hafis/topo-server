import { Admin } from "../../models/admin.model";

export const findAdminByEmail = async (email: string) => {
  return await Admin.findOne({ email });
};
