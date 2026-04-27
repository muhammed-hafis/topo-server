import { Router } from "express";
import { getSectionImages, addSectionImage, updateSectionImage, deleteSectionImage, getSectionImageBySection } from "./cms.controller";
import { upload } from "../../utils/upload";
import { authenticateAdmin } from "../../utils/auth.middleware";

const router = Router();

// CMS routes
router.get("/images", getSectionImages);
router.get("/images/:section", getSectionImageBySection);
router.post("/images", upload.single("image"), addSectionImage);
router.put("/images/:id", upload.single("image"), updateSectionImage);
router.delete("/images/:id", deleteSectionImage);

export default router;
