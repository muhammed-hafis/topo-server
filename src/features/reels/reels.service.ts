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
  // 1. Upload to Cloudinary
  const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/reels");

  // 2. Create in DB
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
  // 1. Find existing reel
  const existingReel = await reelsRepository.findReelById(id);
  if (!existingReel) {
    throw new Error("Reel not found");
  }

  let updateData: any = { ...data };

  // 2. If new file provided, handle Cloudinary replacement
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/reels");

    // Delete old one
    if (existingReel.publicId) {
      await deleteFromCloudinary(existingReel.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.thumbnail = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  // 3. Update in DB
  return await reelsRepository.updateReelById(id, updateData);
};

export const deleteReelService = async (id: string) => {
  const reel = await reelsRepository.findReelById(id);
  if (!reel) {
    throw new Error("Reel not found");
  }

  // 1. Delete from Cloudinary
  if (reel.publicId) {
    await deleteFromCloudinary(reel.publicId);
  }

  // 2. Delete from DB
  return await reelsRepository.deleteReelById(id);
};
