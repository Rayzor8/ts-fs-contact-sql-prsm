import { prisma } from "../applications/database";
import { ResponseError } from "../errors/response-error";
import { validate } from "../validations";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validations/user-validation";
import bycrpt from "bcrypt";
import { Request } from "express";
import { v4 as uuid } from "uuid";

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

const login = async (request: Request) => {
  const user = validate(loginUserValidation, request);

  const findUser = await prisma.user.findUnique({
    where: {
      username: user.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!findUser) throw new ResponseError(401, "Username or password wrong");

  const isValidPassword = await bycrpt.compare(
    user.password,
    findUser.password
  );

  if (!isValidPassword)
    throw new ResponseError(401, "Username or password wrong");

  const token = uuid().toString();

  // update user token and return token
  return prisma.user.update({
    where: {
      username: user.username,
    },
    data: {
      token,
    },
    select: {
      token: true,
    },
  });
};

const getUser = async (username: string) => {
  const validatedUser = validate(getUserValidation, username);

  return prisma.user.findUnique({
    where: {
      username: validatedUser,
    },
    select: {
      username: true,
      name: true,
    },
  });
};

export default { register, login, getUser };
