import type { Request, Response } from "express";
import * as metricsService from "../services/metrics.service.js";

export async function summary(_req: Request, res: Response) {
  const data = await metricsService.getSummary();
  res.json({ data });
}
