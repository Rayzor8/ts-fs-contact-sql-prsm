import { Request, Response, NextFunction } from "express";
import userService from "../services/user-service";
import { CustomRequest } from "../types/request-type";

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

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = (req as CustomRequest).user.username;
    const result = await userService.getUser(username);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUser(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = (req as CustomRequest).user.username;
    await userService.logoutUser(username);
    res.status(200).json({
      data: "Success logout",
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, get, update, logout };
