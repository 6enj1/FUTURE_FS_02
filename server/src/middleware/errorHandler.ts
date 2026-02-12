import type { ErrorRequestHandler } from "express";
import { AppError } from "../lib/errors.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
