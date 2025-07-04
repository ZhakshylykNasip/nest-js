import { User } from '../entities/user.entity';
import { JwtPayload } from './jwt-payload';

export interface ICurrentUser {
  jwtPayload: JwtPayload;
  jwtToken: string;
  userId: string;
  user: User;
}
