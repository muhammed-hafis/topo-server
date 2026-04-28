import * as productRepository from "./product.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";
import { IProduct } from "./product.model";

export const getAllProducts = () => productRepository.findAllProducts();

export const getProductById = async (id: string) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const addProductService = async (
  data: { productName: string; title: string; description: string },

  file: Express.Multer.File
) => {
  // 1. Upload to Cloudinary
  let uploadResult;
  try {
    uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/products");
  } catch {
    throw new Error("Image upload failed. Please try again.");
  }

  // 2. Create in DB
  return await productRepository.createProduct({
    ...data,
    imageUrl: uploadResult.url,
    publicId: uploadResult.publicId,
  });
};

export const updateProductService = async (
  id: string,
  data: Partial<{ productName: string; title: string; description: string }>,

  file?: Express.Multer.File
) => {
  // 1. Find existing product
  const existingProduct = await productRepository.findProductById(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let updateData: Partial<IProduct> = { ...data };

  // 2. If new file provided, handle Cloudinary replacement
  if (file) {
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/products");
    } catch {
      throw new Error("Image upload failed. Please try again.");
    }

    // Delete old one
    if (existingProduct.publicId) {
      await deleteFromCloudinary(existingProduct.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.imageUrl = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  // 3. Update in DB
  return await productRepository.updateProductById(id, updateData);
};

export const deleteProductService = async (id: string) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  // 1. Delete from Cloudinary
  if (product.publicId) {
    await deleteFromCloudinary(product.publicId);
  }

  // 2. Delete from DB
  return await productRepository.deleteProductById(id);
};
