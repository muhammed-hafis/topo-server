import { Router } from "express";
import * as productController from "./product.controller";
import { upload } from "../../config/upload";
import { authenticateAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);


router.post("/", authenticateAdmin, upload.single("image"), productController.createProduct);
router.patch("/:id", authenticateAdmin, upload.single("image"), productController.updateProduct);
router.delete("/:id", authenticateAdmin, productController.deleteProduct);

export default router;
