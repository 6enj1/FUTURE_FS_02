import type { Request, Response } from "express";
import * as leadsService from "../services/leads.service.js";

export async function list(req: Request, res: Response) {
  const result = await leadsService.listLeads(req.query as any);
  res.json({ data: result });
}

export async function getById(req: Request, res: Response) {
  const lead = await leadsService.getLeadById(req.params.id as string);
  res.json({ data: lead });
}

export async function create(req: Request, res: Response) {
  const lead = await leadsService.createLead(req.body);
  res.status(201).json({ data: lead });
}

export async function update(req: Request, res: Response) {
  const lead = await leadsService.updateLead(req.params.id as string, req.body);
  res.json({ data: lead });
}

export async function remove(req: Request, res: Response) {
  await leadsService.deleteLead(req.params.id as string);
  res.status(204).end();
}
