import type { Request, Response } from "express";
import * as followupsService from "../services/followups.service.js";

export async function list(req: Request, res: Response) {
  const followUps = await followupsService.listFollowUps(
    req.params.id as string
  );
  res.json({ data: followUps });
}

export async function create(req: Request, res: Response) {
  const followUp = await followupsService.createFollowUp(
    req.params.id as string,
    req.body
  );
  res.status(201).json({ data: followUp });
}

export async function update(req: Request, res: Response) {
  const followUp = await followupsService.updateFollowUp(
    req.params.followupId as string,
    req.body
  );
  res.json({ data: followUp });
}
