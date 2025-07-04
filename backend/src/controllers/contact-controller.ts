import { Request, Response, NextFunction } from "express";
import contactService from "../services/contact-service";
import { CustomRequest } from "../types/request-type";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;
    const result = await contactService.createContact(user, req.body);
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
    const contactId = Number(req.params.id);
    const result = await contactService.getContact(user, contactId);
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
    const contactId = Number(req.params.id);
    const request = { id: contactId, ...req.body };

    const result = await contactService.updateContact(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, get, update };
