import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Session = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.session;
});

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.session.getUserId();
});
