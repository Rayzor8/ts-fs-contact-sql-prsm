import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validations/contact-validation";
import { prisma } from "../applications/database";
import { validate } from "../validations";
import { ResponseError } from "../errors/response-error";
import { SearchContactRequest } from "../types/request-type";

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

const searchContact = async (user: string, request: SearchContactRequest) => {
  const validatedContact = validate(searchContactValidation, request);

  const page = validatedContact.page;
  const size = validatedContact.size;
  const skip = (page - 1) * size;
  
  const filters = [];

  if (request.name) {
    filters.push({
      OR: [
        { first_name: { contains: request.name } },
        { last_name: { contains: request.name } },
      ],
    });
  }

  if (request.email) {
    filters.push({
      email: { contains: request.email },
    });
  }

  if (request.phone) {
    filters.push({
      phone: { contains: request.phone },
    });
  }

  const [contacts, totalItems] = await Promise.all([
    prisma.contact.findMany({
      where: {
        username: user,
        AND: filters,
      },

      take: size,
      skip,
    }),
    prisma.contact.count({
      where: { username: user, AND: filters },
    }),
  ]);

  return {
    data: contacts,
    paging: {
      page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / size),
    },
  };
};

export default {
  createContact,
  getContact,
  updateContact,
  removeContact,
  searchContact,
};
