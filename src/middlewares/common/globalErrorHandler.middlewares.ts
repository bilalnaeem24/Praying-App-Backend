import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  if (err.message.includes("Duplicate key error")) {
    res
      .status(StatusCodes.CONFLICT)
      .send({ message: err.message || "Internal Server Error" });
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: err.message || "Internal Server Error" });
};
