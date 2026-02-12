import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../lib/jwt.js";
import { unauthorized } from "../lib/errors.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw unauthorized("Missing or invalid authorization header");
  }

  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    throw unauthorized("Invalid or expired token");
  }
}
