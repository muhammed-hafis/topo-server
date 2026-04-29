import Testimonial, { ITestimonial } from "./testimonial.model";

export const createTestimonial = async (data: Partial<ITestimonial>) => {
  return await Testimonial.create(data);
};

export const findAllTestimonials = async (skip: number = 0, limit: number = 10) => 
  await Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();

export const countTestimonials = async () => await Testimonial.countDocuments().exec();


export const findTestimonialById = async (id: string) => {
  return await Testimonial.findById(id);
};

export const updateTestimonialById = async (id: string, data: Partial<ITestimonial>) => {
  return await Testimonial.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTestimonialById = async (id: string) => {
  return await Testimonial.findByIdAndDelete(id);
};
