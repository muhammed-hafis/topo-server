import { Router } from "express";
import * as reelsController from "./reels.controller";
import { authenticateAdmin } from "../../utils/auth.middleware";

const router = Router();

router.get("/", reelsController.getAllReels);
router.get("/:id", reelsController.getReelById);

// Protected routes
router.post("/", authenticateAdmin, reelsController.createReel);
router.patch("/:id", authenticateAdmin, reelsController.updateReel);
router.delete("/:id", authenticateAdmin, reelsController.deleteReel);

export default router;