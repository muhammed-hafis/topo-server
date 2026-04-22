import { Router, Request, Response } from "express";
import { login, handleRefresh } from "./auth.controller";

const router = Router();

router.post("/login", (req: Request, res: Response) => login(req, res));
router.post("/refresh", (req: Request, res: Response) => handleRefresh(req, res));

export default router;
