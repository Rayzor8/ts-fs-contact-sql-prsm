import { Request, Response, NextFunction } from "express";
import addressService from "../services/address-service";
import { CustomRequest } from "../types/request-type";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;
    const id = Number(req.params.id);

    const result = await addressService.createAddress(user, id, req.body);
    
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;
    const id = Number(req.params.id);
    const addressId = Number(req.params.addressId);
    const result = await addressService.getAddress(user, id, addressId);
    
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, get };
