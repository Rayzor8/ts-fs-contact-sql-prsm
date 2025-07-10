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
    const contactId = Number(req.params.contactId);
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
    const contactId = Number(req.params.contactId);
    const request = { id: contactId, ...req.body };

    const result = await contactService.updateContact(user, request);
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
    await contactService.removeContact(user, contactId);
    res.status(200).json({
      data: "Success remove contact",
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user.username;

    const request = {
      name: req.query.name as string,
      email: req.query.email as string,
      phone: req.query.phone as string,
      page: req.query.page ? Number(req.query.page) : 1,
      size: req.query.size ? Number(req.query.size) : 10,
    };

    const result = await contactService.searchContact(user, request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, get, update, remove, search };
