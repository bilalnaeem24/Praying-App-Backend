import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../api/user/user.types";

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(403).json({ message: "Forbidden: User not authenticated" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }

    next();
  };
};
