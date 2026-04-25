import { Router } from "express";
import * as testimonialController from "./testimonial.controller";
import { upload } from "../../utils/upload";
import { authenticateAdmin } from "../../utils/auth.middleware";

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
  upload.single("profileImage"),
  testimonialController.updateTestimonial
);

router.delete("/:id", authenticateAdmin, testimonialController.deleteTestimonial);

export default router;
