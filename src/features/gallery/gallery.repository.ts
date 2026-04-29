import Gallery, { IGallery } from "./gallery.model";

export const createGallery = async (data: Partial<IGallery>) => {
  return await Gallery.create(data);
};

export const findAllGalleryImages = (skip: number = 0, limit: number = 15) => Gallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

export const countGalleryImages = () => Gallery.countDocuments();


export const findGalleryById = async (id: string) => {
  return await Gallery.findById(id);
};

export const updateGalleryById = async (id: string, data: Partial<IGallery>) => {
  return await Gallery.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGalleryById = async (id: string) => {
  return await Gallery.findByIdAndDelete(id);
};
