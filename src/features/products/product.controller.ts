import { Request, Response } from "express";
import * as productService from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.schema";
import { z } from "zod";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const newProduct = await productService.addProductService(validatedData, req.file);

    return res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to create product" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id as string);
    return res.status(200).json(product);
  } catch (error: any) {
    const status = error.message === "Product not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);

    const updatedProduct = await productService.updateProductService(
      id as string,
      validatedData,
      req.file
    );

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(400).json({ message: error.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProductService(id as string);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Failed to delete product" });
  }
};
