import { Admin } from "./admin.model";

export const findAdminByEmail = async (email: string) => {
  return await Admin.findOne({ email });
};
