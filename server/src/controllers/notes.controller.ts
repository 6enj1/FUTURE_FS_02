import type { Request, Response } from "express";
import * as notesService from "../services/notes.service.js";

export async function list(req: Request, res: Response) {
  const notes = await notesService.listNotes(req.params.id as string);
  res.json({ data: notes });
}

export async function create(req: Request, res: Response) {
  const note = await notesService.createNote(req.params.id as string, req.body);
  res.status(201).json({ data: note });
}
