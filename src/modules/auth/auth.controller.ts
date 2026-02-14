// auth.controller.ts
import type { Request, Response } from "express";
import { loginService, refreshService, registerService } from "./auth.service";

export async function registerController(req: Request, res: Response) {
  const { email, password, orgName } = req.body;

  const result = await registerService({ email, password, orgName });
  res.status(201).json(result);
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  const tokens = await loginService({ email, password });
  res.status(200).json({ tokens });
}

export async function refreshController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const tokens = await refreshService({ refreshToken });
  res.status(200).json({ tokens });
}
