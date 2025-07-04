import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from '../interfaces/current-user';

const getUserFromExecutionContext = (
  context: ExecutionContext,
): ICurrentUser | null => {
  if (context.getType() === 'http') {
    const req = context.switchToHttp().getRequest<Request>();
    return req.user as ICurrentUser;
  }
  return null;
};

export const CurrentUser = createParamDecorator(
  (key: keyof ICurrentUser | undefined, context: ExecutionContext) => {
    try {
      const user = getUserFromExecutionContext(context);
      if (!user) {
        throw new UnauthorizedException('User not found!');
      }
      if (!key) return user;
      return user[key];
    } catch (error) {
      const logger = new Logger('@CurrentUser()');
      logger.error(error);
      throw new UnauthorizedException('User not found!');
    }
  },
);
