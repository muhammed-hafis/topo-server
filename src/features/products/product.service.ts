import * as productRepository from "./product.repository";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../config/cloudinary";
import { IProduct } from "./product.model";

export const getAllProducts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    productRepository.findAllProducts(skip, limit),
    productRepository.countProducts(),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

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
  
  let uploadResult;
  try {
    uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/products");
  } catch {
    throw new Error("Image upload failed. Please try again.");
  }

  
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
  
  const existingProduct = await productRepository.findProductById(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let updateData: Partial<IProduct> = { ...data };

  
  if (file) {
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(file.buffer, "topo-admin/products");
    } catch {
      throw new Error("Image upload failed. Please try again.");
    }

    
    if (existingProduct.publicId) {
      await deleteFromCloudinary(existingProduct.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    updateData.imageUrl = uploadResult.url;
    updateData.publicId = uploadResult.publicId;
  }

  
  return await productRepository.updateProductById(id, updateData);
};

export const deleteProductService = async (id: string) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  
  if (product.publicId) {
    await deleteFromCloudinary(product.publicId);
  }

  
  return await productRepository.deleteProductById(id);
};
