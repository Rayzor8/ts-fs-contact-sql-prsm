import { Request } from "express";
import { prisma } from "../applications/database";
import { createAddressValidation } from "../validations/address-validation";
import { getContactValidation } from "../validations/contact-validation";

import { validate } from "../validations";
import { ResponseError } from "../errors/response-error";

const createAddress = async (
  user: string,
  contactId: number,
  request: Request
) => {
  contactId = validate(getContactValidation, contactId);

  const totalContact = await prisma.contact.count({
    where: {
      id: contactId,
      username: user,
    },
  });

  if (totalContact === 0) throw new ResponseError(404, "Contact is not found");

  const validatedAddress = validate(createAddressValidation, request);

  return await prisma.address.create({
    data: {
      ...validatedAddress,
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default { createAddress };
