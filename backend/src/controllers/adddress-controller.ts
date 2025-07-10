import { Request, Response, NextFunction, request } from "express";
import addressService from "../services/address-service";
import { CustomRequest } from "../types/request-type";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;
    const contactId = Number(req.params.contactId);

    const result = await addressService.createAddress(
      user,
      contactId,
      req.body
    );

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
    const contactId = Number(req.params.contactId);
    const addressId = Number(req.params.addressId);
    const result = await addressService.getAddress(user, contactId, addressId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;
    const contactId = Number(req.params.contactId);
    const addressId = Number(req.params.addressId);
    const request = { ...req.body, id: addressId };
    const result = await addressService.updateAddress(user, contactId, request);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;
    const contactId = Number(req.params.contactId);
    const addressId = Number(req.params.addressId);

    await addressService.removeAddress(user, contactId, addressId);
    res.status(200).json({
      data: "Success remove address",
    });
  } catch (error) {
    next(error);
  }
};

export default { create, get, update, remove };
