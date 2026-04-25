import * as testimonialRepository from "./testimonial.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary";
import { ITestimonial } from "./testimonial.model";

export const createTestimonialService = async (
  data: Partial<ITestimonial>,
  file: Express.Multer.File
) => {
  const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/testimonials");

  return await testimonialRepository.createTestimonial({
    ...data,
    avatar: uploadResult.url,
    publicId: uploadResult.publicId,
  });
};

export const getAllTestimonials = async () => {
  return testimonialRepository.findAllTestimonials();
};

export const getTestimonialById = async (id: string) => {
  const testimonial = await testimonialRepository.findTestimonialById(id);
  if (!testimonial) {
    throw new Error("Testimonial not found");
  }
  return testimonial;
};

export const updateTestimonialService = async (
  id: string,
  data: Partial<ITestimonial>,
  file?: Express.Multer.File
) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);
  if (!existingTestimonial) {
    throw new Error("Testimonial not found");
  }

  let updateData: Partial<ITestimonial> = { ...data };

  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/testimonials");

    if (existingTestimonial.publicId) {
      await deleteFromCloudinary(existingTestimonial.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.avatar = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  return await testimonialRepository.updateTestimonialById(id, updateData);
};

export const deleteTestimonialService = async (id: string) => {
  const testimonial = await testimonialRepository.findTestimonialById(id);
  if (!testimonial) {
    throw new Error("Testimonial not found");
  }

  if (testimonial.publicId) {
    await deleteFromCloudinary(testimonial.publicId);
  }

  return await testimonialRepository.deleteTestimonialById(id);
};
