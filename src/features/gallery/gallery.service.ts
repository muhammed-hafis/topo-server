import * as galleryRepository from "./gallery.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";
import { IGallery } from "./gallery.model";

export const getAllGalleryImages = () => galleryRepository.findAllGalleryImages();

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
  // 1. Upload to Cloudinary
  const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/gallery");

  // 2. Create in DB
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
  // 1. Find existing item
  const existingItem = await galleryRepository.findGalleryById(id);
  if (!existingItem) {
    throw new Error("Gallery item not found");
  }

  let updateData: Partial<IGallery> = {};


  // 2. If new file provided, handle Cloudinary replacement
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/gallery");

    // Delete old one
    if (existingItem.publicId) {
      await deleteFromCloudinary(existingItem.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.imageUrl = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  // 3. Update in DB
  return await galleryRepository.updateGalleryById(id, updateData);
};

export const deleteGalleryService = async (id: string) => {
  const item = await galleryRepository.findGalleryById(id);
  if (!item) {
    throw new Error("Gallery item not found");
  }

  // 1. Delete from Cloudinary
  if (item.publicId) {
    await deleteFromCloudinary(item.publicId);
  }

  // 2. Delete from DB
  return await galleryRepository.deleteGalleryById(id);
};
