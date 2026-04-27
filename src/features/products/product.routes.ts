import { Router } from "express";
import * as productController from "./product.controller";
import { upload } from "../../utils/upload";
import { authenticateAdmin } from "../../utils/auth.middleware";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes
router.post("/", upload.single("image"), productController.createProduct);
router.patch("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
