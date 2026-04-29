import { Router, Request, Response } from "express";
import { login, logout } from "./auth.controller";

const router = Router();

router.post("/login", (req: Request, res: Response) => login(req, res));

router.post("/logout", (req: Request, res: Response) => logout(req, res));

export default router;
