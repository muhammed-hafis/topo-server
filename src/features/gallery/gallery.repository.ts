import Gallery, { IGallery } from "./gallery.model";

export const createGallery = async (data: Partial<IGallery>) => {
  return await Gallery.create(data);
};

export const findAllGalleryImages = () => Gallery.find().sort({ createdAt: -1 });


export const findGalleryById = async (id: string) => {
  return await Gallery.findById(id);
};

export const updateGalleryById = async (id: string, data: Partial<IGallery>) => {
  return await Gallery.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGalleryById = async (id: string) => {
  return await Gallery.findByIdAndDelete(id);
};
