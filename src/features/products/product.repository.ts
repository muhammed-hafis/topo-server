import Product, { IProduct } from "./product.model";

export const createProduct = async (data: Partial<IProduct>) => {
  return await Product.create(data);
};

export const findAllProducts = async (skip: number = 0, limit: number = 10) => 
  await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();

export const countProducts = async () => await Product.countDocuments().exec();

export const findProductById = async (id: string) => {
  return await Product.findById(id);
};

export const updateProductById = async (id: string, data: Partial<IProduct>) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProductById = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
