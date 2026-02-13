import { Request } from 'express';
export interface AppRequest extends Request {
  user: { email: string };
  depositedMoney: { id: number };
}
