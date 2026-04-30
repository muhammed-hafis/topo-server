import * as cmsRepository from "./cms.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";
import { ISectionImage } from "./section-image.model";
import { isValidObjectId } from "mongoose";

export const getAllImages = async () => {
  return await cmsRepository.findAllImages();
};

export const getImageBySection = async (section: string) => {
  return cmsRepository.findBySection(section);
};

export const addImageService = async (
  section: "hero" | "about" | "why-choose" | "cta",
  file: Express.Multer.File
) => {
  
  const currentCount = await cmsRepository.countBySection(section);
  const limit = section === "about" ? 2 : 1;

  if (currentCount >= limit) {
    throw new Error(
      `Cannot add more images. Maximum limit for ${section} is ${limit}. Current count: ${currentCount}`
    );
  }

  
  let uploadResult;
  try {
    uploadResult = await uploadBufferToCloudinary(file.buffer, `topo-admin/${section}`);
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  try {
    return await cmsRepository.createSectionImage({
      section,
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,


    });
  } catch (error) {
    await deleteFromCloudinary(uploadResult.publicId).catch(() => { });
    throw new Error(`Failed to save image metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

};

export const updateImageService = async (
  id: string,
  file: Express.Multer.File  
) => {
  
  const existingImage = await cmsRepository.findById(id);
  if (!existingImage) {
    throw new Error("Image not found");
  }

  let updateData: Partial<ISectionImage> = {};

  try {
    
    const uploadResult = await uploadBufferToCloudinary(
      file.buffer,
      `topo-admin/${existingImage.section}`
    );

    updateData.imageUrl = uploadResult.url;
    updateData.publicId = uploadResult.publicId;

    
    if (existingImage.publicId) {
      deleteFromCloudinary(existingImage.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    
    return await cmsRepository.updateById(id, updateData);
  } catch (error) {
    
    if (updateData.publicId) {
      await deleteFromCloudinary(updateData.publicId).catch(() => {
        
      });
    }
    throw error;
  }
};


export const deleteImageService = async (id: string) => {

  if (!isValidObjectId(id)) {
    throw new Error("Invalid image ID");
  }

  const image = await cmsRepository.deleteById(id);

  if (!image) {
    throw new Error("Image not found");
  }

  
  if (image.publicId) {
    deleteFromCloudinary(image.publicId)
      .catch((err) => {
        console.error(
          `Failed to delete Cloudinary asset ${image.publicId}:`,
          err.message
        );
      });
  }

  
  return image;
};
