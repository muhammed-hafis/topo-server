import { Router } from "express";
import * as reelsController from "./reels.controller";
import { authenticateAdmin } from "../../middlewares/auth.middleware";
import { upload } from "../../config/upload";

const router = Router();

router.get("/", reelsController.getAllReels);
router.get("/:id", reelsController.getReelById);


router.post(
  "/",
  authenticateAdmin,
  upload.single("thumbnail"),
  reelsController.createReel
);
router.patch(
  "/:id",
  authenticateAdmin,
  upload.single("thumbnail"),
  reelsController.updateReel
);
router.delete("/:id", authenticateAdmin, reelsController.deleteReel);

export default router;