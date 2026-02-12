import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.json({ data: result });
}

export async function me(req: Request, res: Response) {
  const user = await authService.getProfile(req.user!.userId);
  res.json({ data: user });
}
