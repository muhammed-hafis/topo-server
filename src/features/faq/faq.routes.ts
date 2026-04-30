import { Router } from "express";
import * as faqController from "./faq.controller";
import { authenticateAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", faqController.getAllFAQs);
router.get("/:id", faqController.getFAQById);


router.post("/", authenticateAdmin, faqController.createFAQ);
router.put("/:id", authenticateAdmin, faqController.updateFAQ);
router.delete("/:id", authenticateAdmin, faqController.deleteFAQ);

export default router;
