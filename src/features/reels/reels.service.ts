import * as reelsRepository from "./reels.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";
import { IReel } from "./reels.model";

export const getAllReels = async () => {
  return await reelsRepository.findAllReels();
};

export const getReelById = async (id: string) => {
  const reel = await reelsRepository.findReelById(id);
  if (!reel) {
    throw new Error("Reel not found");
  }
  return reel;
};

export const addReelService = async (
  data: { link: string },
  file: Express.Multer.File
) => {
  
  const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/reels");

  
  return await reelsRepository.createReel({
    link: data.link,
    thumbnail: uploadResult.url,
    publicId: uploadResult.publicId,
  });
};

export const updateReelService = async (
  id: string,
  data: Partial<{ link: string }>,
  file?: Express.Multer.File
) => {
  
  const existingReel = await reelsRepository.findReelById(id);
  if (!existingReel) {
    throw new Error("Reel not found");
  }

  let updateData: any = { ...data };

  
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/reels");

    
    if (existingReel.publicId) {
      await deleteFromCloudinary(existingReel.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.thumbnail = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  
  return await reelsRepository.updateReelById(id, updateData);
};

export const deleteReelService = async (id: string) => {
  const reel = await reelsRepository.findReelById(id);
  if (!reel) {
    throw new Error("Reel not found");
  }

  
  if (reel.publicId) {
    await deleteFromCloudinary(reel.publicId);
  }

  
  return await reelsRepository.deleteReelById(id);
};
