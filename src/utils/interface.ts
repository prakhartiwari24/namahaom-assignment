import { Request } from 'express';
import { UserDoc } from '../models/user.model';

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserDoc;
}

export interface LoginPayload {
  email: string;
  password: string;
}
