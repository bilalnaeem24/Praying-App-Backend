import { NextFunction, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import userService from "./user.service";
import { validateUser } from "./user.validation";

class UserController {
  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error } = validateUser(req.body);
      if (error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            message: getReasonPhrase(StatusCodes.BAD_REQUEST),
            details: error.details,
          });
        return;
      }

      const user = await userService.createUser(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ data: user, message: getReasonPhrase(StatusCodes.CREATED) });
    } catch (err) {
      next(err);
    }
  }

  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { users, total, pages } = await userService.getUsers(page, limit);

      res
        .status(StatusCodes.OK)
        .json({
          data: users,
          total,
          pages,
          page,
          message: getReasonPhrase(StatusCodes.OK),
        });
    } catch (err) {
      next(err);
    }
  }

  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);

      res
        .status(StatusCodes.OK)
        .json({ data: user, message: getReasonPhrase(StatusCodes.OK) });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
