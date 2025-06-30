import { ResponseError } from "../errors/response-error";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) return next();

  if (error instanceof ResponseError) {
    res.status(error.status).json({ errors: error.message });
  } else {
    res.status(500).json({ errors: error.message });
  }
};

export { errorMiddleware };
