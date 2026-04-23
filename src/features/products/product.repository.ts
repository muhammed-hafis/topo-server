import Product, { IProduct } from "./product.model";

export const createProduct = async (data: Partial<IProduct>) => {
  return await Product.create(data);
};

export const findAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

export const findProductById = async (id: string) => {
  return await Product.findById(id);
};

export const updateProductById = async (id: string, data: Partial<IProduct>) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProductById = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
