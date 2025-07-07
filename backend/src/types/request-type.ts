import { Request } from "express";

export interface CustomRequest extends Request {
  user: {
    username: string;
  };
}

export interface SearchContactRequest {
  page?: string;
  size?: string;
  name?: string;
  email?: string;
  phone?: string;
}
