// auth.controller.ts
import type { Request, Response } from "express";
import { registerService } from "./auth.service";

export async function registerController(req: Request, res: Response) {

    const {email, password, orgName} = req.body;

    const result = await registerService({
        email,
        password,
        orgName,
    });

    res.status(201).json(result);
}