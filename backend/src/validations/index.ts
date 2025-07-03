import Joi from "joi/lib";
import { ResponseError } from "../errors/response-error";

const validate = <T>(schema: Joi.AnySchema, request: T) => {
  const { value, error } = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  console.log(error);
  if (error) throw new ResponseError(400, error.message);

  return value;
};

export { validate };
