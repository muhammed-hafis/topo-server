import { Router, Request, Response } from "express";
import { login } from "./auth.controller";

const router = Router();

router.post("/login", (req: Request, res: Response) => login(req, res));

export default router;
