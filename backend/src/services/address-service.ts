import { Request } from "express";
import { prisma } from "../applications/database";
import {
  createAddressValidation,
  getAddressValidation,
} from "../validations/address-validation";
import { getContactValidation } from "../validations/contact-validation";
import { validate } from "../validations";
import { ResponseError } from "../errors/response-error";

const checkContact = async (user: string, contactId: number) => {
  contactId = validate(getContactValidation, contactId);
  const totalContact = await prisma.contact.count({
    where: {
      id: contactId,
      username: user,
    },
  });

  if (totalContact === 0) throw new ResponseError(404, "Contact is not found");

  return contactId;
};

const createAddress = async (
  user: string,
  contactId: number,
  request: Request
) => {
  contactId = await checkContact(user, contactId);

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

const getAddress = async (
  user: string,
  contactId: number,
  addressId: number
) => {
  contactId = await checkContact(user, contactId);

  addressId = validate(getAddressValidation, addressId);

  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
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

  if (!address) throw new ResponseError(404, "Address is not found");

  return address;
};

export default { createAddress, getAddress };
