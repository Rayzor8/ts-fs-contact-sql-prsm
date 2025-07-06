import {
  createContactValidation,
  getContactValidation,
  updateContactValidation,
} from "../validations/contact-validation";
import { prisma } from "../applications/database";
import { validate } from "../validations";
import { ResponseError } from "../errors/response-error";

const createContact = async (user: string, request: Request) => {
  const validatedContact = validate(createContactValidation, request);
  validatedContact.username = user;

  return prisma.contact.create({
    data: validatedContact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const getContact = async (user: string, contactId: number) => {
  const validatedContactId = validate(getContactValidation, contactId);

  const contact = await prisma.contact.findUnique({
    where: {
      id: validatedContactId,
      username: user,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) throw new ResponseError(404, "Contact is not found");

  return contact;
};

const updateContact = async (user: string, request: Request) => {
  const validatedContact = validate(updateContactValidation, request);

  const totalCountContact = await prisma.contact.count({
    where: {
      id: validatedContact.id,
      username: user,
    },
  });

  if (totalCountContact === 0)
    throw new ResponseError(404, "Contact is not found");

  return prisma.contact.update({
    where: {
      id: validatedContact.id,
    },
    data: {
      first_name: validatedContact.first_name,
      last_name: validatedContact.last_name,
      email: validatedContact.email,
      phone: validatedContact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const removeContact = async (user: string, contactId: number) => {
  const validatedContactId = validate(getContactValidation, contactId);

  const totalCountContact = await prisma.contact.count({
    where: {
      id: validatedContactId,
      username: user,
    },
  });

  if (totalCountContact === 0)
    throw new ResponseError(404, "Contact is not found");

  return prisma.contact.delete({
    where: {
      id: validatedContactId,
    },
  });
};

export default { createContact, getContact, updateContact, removeContact };
