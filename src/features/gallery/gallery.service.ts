import * as galleryRepository from "./gallery.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";
import { IGallery } from "./gallery.model";

export const getAllGalleryImages = async (page: number = 1, limit: number = 15) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    galleryRepository.findAllGalleryImages(skip, limit),
    galleryRepository.countGalleryImages()
  ]);
  
  return {
    data,
    total,
    page,
    limit,
    hasMore: skip + data.length < total
  };
};

export const getGalleryById = async (id: string) => {
  const item = await galleryRepository.findGalleryById(id);
  if (!item) {
    throw new Error("Gallery item not found");
  }
  return item;
};

export const addGalleryService = async (
  data: {},
  file: Express.Multer.File
) => {
  
  const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/gallery");

  
  return await galleryRepository.createGallery({
    imageUrl: uploadResult.url,
    publicId: uploadResult.publicId,
  });
};

export const updateGalleryService = async (
  id: string,
  data: Partial<{}>,
  file?: Express.Multer.File
) => {
  
  const existingItem = await galleryRepository.findGalleryById(id);
  if (!existingItem) {
    throw new Error("Gallery item not found");
  }

  let updateData: Partial<IGallery> = {};


  
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/gallery");

    
    if (existingItem.publicId) {
      await deleteFromCloudinary(existingItem.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.imageUrl = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  
  return await galleryRepository.updateGalleryById(id, updateData);
};

export const deleteGalleryService = async (id: string) => {
  const item = await galleryRepository.findGalleryById(id);
  if (!item) {
    throw new Error("Gallery item not found");
  }

  
  if (item.publicId) {
    await deleteFromCloudinary(item.publicId);
  }

  
  return await galleryRepository.deleteGalleryById(id);
};
