import { Request, Response, NextFunction } from "express";
import userService from "../services/user-service";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login };
