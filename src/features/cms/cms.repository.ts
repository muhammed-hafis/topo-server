import SectionImage, { ISectionImage } from "../../models/section-image.model";

export const findAllImages = async (): Promise<ISectionImage[]> => {
  return await SectionImage.find();
};

export const findBySection = async (
  section: string
): Promise<ISectionImage[]> => {
  return await SectionImage.find({ section });
};
export const findById = async (id: string): Promise<ISectionImage | null> => {
  return await SectionImage.findById(id);
};

export const countBySection = async (section: string): Promise<number> => {
  return await SectionImage.countDocuments({ section });
};

export const createSectionImage = async (data: Partial<ISectionImage>): Promise<ISectionImage> => {
  return await SectionImage.create(data);
};

export const updateById = async (
  id: string,
  data: Partial<ISectionImage>
): Promise<ISectionImage | null> => {
  return await SectionImage.findByIdAndUpdate(id, { $set: data }, { new: true });
};

export const deleteById = async (id: string): Promise<ISectionImage | null> => {
  return await SectionImage.findByIdAndDelete(id);
};
