import { Router } from "express";
import * as galleryController from "./gallery.controller";
import { upload } from "../../utils/upload";
import { authenticateAdmin } from "../../utils/auth.middleware";
const router = Router();

router.get("/", galleryController.getAllGalleryImages);
router.get("/:id", galleryController.getGalleryItemById);

// Protected routes
router.post(
  "/",
  authenticateAdmin,
  upload.single("image"),
  galleryController.createGalleryItem
);

router.put(
  "/:id",
  authenticateAdmin,
  upload.single("image"),
  galleryController.updateGalleryItem
);

router.delete("/:id", authenticateAdmin, galleryController.deleteGalleryItem);

export default router;
