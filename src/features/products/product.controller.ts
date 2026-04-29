import { Request, Response } from "express";
import * as productService from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.schema";
import { z } from "zod";

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { image: "Product image is required" },
      });
    }

    const newProduct = await productService.addProductService(parsed.data, req.file);

    return res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to create product" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const result = await productService.getAllProducts(page, limit);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await productService.getProductById(id);
    return res.status(200).json(product);
  } catch (error: any) {
    const status = error.message === "Product not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to fetch product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateProductSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodErrors(parsed.error),
      });
    }

    const updatedProduct = await productService.updateProductService(id, parsed.data, req.file);

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    const status = error.message === "Product not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await productService.deleteProductService(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    const status = error.message === "Product not found" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Failed to delete product" });
  }
};
