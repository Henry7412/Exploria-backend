import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export const GetAuth = createParamDecorator(
  (_data, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) {
      return undefined;
    }

    const { _id } = req.user;

    return {
      ...req.user,
      _id: new Types.ObjectId(_id),
    };
  },
);
