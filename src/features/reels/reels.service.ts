import * as reelsRepository from "./reels.repository";
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
  data: { title: string; link: string }
) => {
  // Directly create in DB
  return await reelsRepository.createReel(data);
};

export const updateReelService = async (
  id: string,
  data: Partial<{ title: string; link: string }>
) => {
  // 1. Find existing reel
  const existingReel = await reelsRepository.findReelById(id);
  if (!existingReel) {
    throw new Error("Reel not found");
  }

  // 2. Update in DB
  return await reelsRepository.updateReelById(id, data);
};

export const deleteReelService = async (id: string) => {
  const reel = await reelsRepository.findReelById(id);
  if (!reel) {
    throw new Error("Reel not found");
  }

  // Delete from DB
  return await reelsRepository.deleteReelById(id);
};
