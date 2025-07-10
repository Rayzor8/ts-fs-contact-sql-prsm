import { Request } from "express";

export interface CustomRequest extends Request {
  user: {
    username: string;
  };
}

export interface SearchContactRequest {
  page: string | number;
  size: string | number;
  name?: string;
  email?: string;
  phone?: string;
}
