import { Router } from "express";
import * as testimonialController from "./testimonial.controller";
import { upload } from "../../config/upload";
import { authenticateAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", testimonialController.getAllTestimonials);
router.get("/:id", testimonialController.getTestimonialById);

router.post(
  "/",
  authenticateAdmin,
  upload.single("avatar"),
  testimonialController.createTestimonial
);

router.patch(
  "/:id",
  authenticateAdmin,
  upload.single("avatar"),
  testimonialController.updateTestimonial
);

router.delete("/:id", authenticateAdmin, testimonialController.deleteTestimonial);

export default router;
