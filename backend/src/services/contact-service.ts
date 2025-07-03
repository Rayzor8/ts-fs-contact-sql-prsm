import { createContactValidation } from "../validations/contact-validation";
import { prisma } from "../applications/database";
import { validate } from "../validations";

const createContact = async (user: string, request: Request) => {
  const contact = validate(createContactValidation, request);
  contact.username = user;
  return prisma.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};


export default { createContact };