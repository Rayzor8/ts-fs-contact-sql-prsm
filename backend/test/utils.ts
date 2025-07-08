import { ResponseError } from "../src/errors/response-error";
import prisma from "../src/applications/database";
import bcrypt from "bcrypt";

// Test user
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

// Test contact

export const removeAllTestContact = async () => {
  await prisma.contact.deleteMany({
    where: {
      username: "rayzor",
    },
  });
};

export const createTestContact = async () => {
  await prisma.contact.create({
    data: {
      username: "rayzor",
      first_name: "rayzor",
      last_name: "dev",
      email: "example@example.com",
      phone: "08123456789",
    },
  });
};

export const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prisma.contact.create({
      data: {
        username: "rayzor",
        first_name: `rayzor${i}`,
        last_name: `dev${i}`,
        email: `example${i}@example.com`,
        phone: `08000900${i}`,
      },
    });
  }
};

export const getTestContact = async () => {
  return await prisma.contact.findFirst({
    where: {
      username: "rayzor",
    },
  });
};

export const removeAllTestAddress = async () => {
  await prisma.address.deleteMany({
    where: {
      contact: {
        username: "rayzor",
      },
    },
  });
};

export const createTestAddress = async () => {
  const contact = await getTestContact();

  if (!contact) throw new ResponseError(404, "Contact is not found");

  return await prisma.address.create({
    data: {
      contact_id: contact.id,
      street: "street 1",
      city: "city 1",
      province: "province 1",
      country: "country 1",
      postal_code: "12345",
    },
  });
};

export const getTestAddress = async () => {
  const contact = await getTestContact();
  return await prisma.address.findFirst({
    where: {
      contact_id: contact?.id,
    },
  });
};
