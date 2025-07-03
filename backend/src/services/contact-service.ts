import {
  createContactValidation,
  getContactValidation,
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

export default { createContact, getContact };
