import Reel, { IReel } from "./reels.model";

export const createReel = async (data: Partial<IReel>) => {
  return await Reel.create(data);
};

export const findAllReels = async () => {
  return await Reel.find().sort({ createdAt: -1 });
};

export const findReelById = async (id: string) => {
  return await Reel.findById(id);
};

export const updateReelById = async (id: string, data: Partial<IReel>) => {
  return await Reel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReelById = async (id: string) => {
  return await Reel.findByIdAndDelete(id);
};
