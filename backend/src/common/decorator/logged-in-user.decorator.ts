import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../modules/user/dto/user.dto';

export const LoggedInUser = createParamDecorator<User, ExecutionContext>(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    return request.user;
  },
);
