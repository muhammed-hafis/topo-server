import { Router } from "express";
import { handleUpdateProfile, handleUpdatePassword } from "./profile.controller";
import { authenticateAdmin } from "../../utils/auth.middleware";

const router = Router();

router.put("/update-profile", authenticateAdmin, handleUpdateProfile);
router.put("/update-password", authenticateAdmin, handleUpdatePassword);

export default router;
