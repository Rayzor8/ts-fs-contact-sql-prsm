import Joi from "joi/lib";
import { Request } from "express";
import { ResponseError } from "../errors/response-error";

const validate = (schema: Joi.ObjectSchema, request: Request) => {
  const { value, error } = schema.validate(request,{
    abortEarly: false,
    allowUnknown: false
  });

  if (error) throw new ResponseError(400, error.message);

  return value;
};

export { validate };
