import * as cmsRepository from "./cms.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary";
import { ISectionImage } from "./section-image.model";

export const getAllImages = async () => {
  return await cmsRepository.findAllImages();
};

export const getImageBySection = async (section: string) => {
  const images = await cmsRepository.findBySection(section);
  if (!images || images.length === 0) {
    throw new Error(`No image found for section: ${section}`);
  }
  return images;
};

export const addImageService = async (
  section: "hero" | "about" | "why-choose" | "cta",
  file: Express.Multer.File
) => {
  // 1. Enforce limits
  const currentCount = await cmsRepository.countBySection(section);
  const limit = section === "about" ? 2 : 1;

  if (currentCount >= limit) {
    throw new Error(
      `Cannot add more images. Maximum limit for ${section} is ${limit}. Current count: ${currentCount}`
    );
  }

  // 2. Upload to Cloudinary
  const uploadResult = await uploadBufferToCloudinary(file.buffer, `topo-admin/${section}`);

  // 3. Create in DB
  return await cmsRepository.createSectionImage({
    section,
    imageUrl: uploadResult.url,
    publicId: uploadResult.publicId,


  });
};

export const updateImageService = async (
  id: string,
  file?: Express.Multer.File
) => {
  // 1. Find existing image
  const existingImage = await cmsRepository.findById(id);
  if (!existingImage) {
    throw new Error("Image not found");
  }

  let updateData: Partial<ISectionImage> = {};



  // 2. If new file provided, handle Cloudinary replacement
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, `topo-admin/${existingImage.section}`);

    // Delete old one
    if (existingImage.publicId) {
      await deleteFromCloudinary(existingImage.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.imageUrl = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  // 3. Update in DB
  return await cmsRepository.updateById(id, updateData);
};

export const deleteImageService = async (id: string) => {
  const image = await cmsRepository.findById(id);
  if (!image) {
    throw new Error("Image not found");
  }

  // 1. Delete from Cloudinary
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }

  // 2. Delete from DB
  return await cmsRepository.deleteById(id);
};
