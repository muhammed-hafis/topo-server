import { Router } from "express";
import { getSectionImages, addSectionImage, updateSectionImage, deleteSectionImage, getSectionImageBySection } from "./cms.controller";
import { upload } from "../../config/upload";
import { authenticateAdmin } from "../../middlewares/auth.middleware";

const router = Router();

// CMS routes
router.get("/images", getSectionImages);
router.get("/images/:section", getSectionImageBySection);
router.post("/images", authenticateAdmin, upload.single("image"), addSectionImage);
router.put("/images/:id", authenticateAdmin, upload.single("image"), updateSectionImage);
router.delete("/images/:id", authenticateAdmin, deleteSectionImage);

export default router;
