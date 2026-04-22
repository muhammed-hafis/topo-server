import FAQ, { IFAQ } from "../../models/faq.model";

export const createFAQ = async (data: Partial<IFAQ>) => {
  return await FAQ.create(data);
};

export const findAllFAQs = async () => {
  return await FAQ.find().sort({ createdAt: -1 });
};

export const findFAQById = async (id: string) => {
  return await FAQ.findById(id);
};

export const updateFAQById = async (id: string, data: Partial<IFAQ>) => {
  return await FAQ.findByIdAndUpdate(id, data, { new: true });
};

export const deleteFAQById = async (id: string) => {
  return await FAQ.findByIdAndDelete(id);
};
