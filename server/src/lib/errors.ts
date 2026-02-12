export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function badRequest(message: string, details?: unknown): AppError {
  return new AppError(400, "BAD_REQUEST", message, details);
}

export function unauthorized(message = "Invalid credentials"): AppError {
  return new AppError(401, "UNAUTHORIZED", message);
}

export function notFound(resource = "Resource"): AppError {
  return new AppError(404, "NOT_FOUND", `${resource} not found`);
}

export function conflict(message: string): AppError {
  return new AppError(409, "CONFLICT", message);
}
