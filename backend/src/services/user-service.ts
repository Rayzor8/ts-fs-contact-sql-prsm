import { prisma } from "../applications/database";
import { ResponseError } from "../errors/response-error";
import { validate } from "../validations";
import { registerUserValidation } from "../validations/user-validation";
import bycrpt from "bcrypt";
import { Request } from "express";

const register = async (request: Request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prisma.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) throw new ResponseError(400, "username already exist");

  user.password = await bycrpt.hash(user.password, 10);

  return prisma.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

export default { register };
