import { Request } from 'express';
import { AuthUser } from 'src/auth/models/auth-user';
import { PayloadToken } from 'src/auth/models/token.model';

export interface IAuthRequest extends Request {
  user: AuthUser | PayloadToken;
}
