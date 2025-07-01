import prisma from "../src/applications/database";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
  await prisma.user.deleteMany({
    where: {
      username: "rayzor",
    },
  });
};

export const createTestUser = async () => {
  await prisma.user.create({
    data: {
      username: "rayzor",
      password: await bcrypt.hash("secret", 10),
      name: "Rayzordev",
      token: "token",
    },
  });
};

export const getTestUser = async () => {
  return await prisma.user.findUnique({
    where: {
      username: "rayzor",
    },
  });
};
