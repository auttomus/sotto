import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserPayload {
  userId: string;
  accountId: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    // GraphQL context: req lives inside GqlExecutionContext
    const gqlCtx = GqlExecutionContext.create(ctx);
    const gqlReq = gqlCtx.getContext()?.req;
    if (gqlReq?.user) {
      return gqlReq.user as CurrentUserPayload;
    }

    // REST context: req lives on the HTTP layer
    const httpReq = ctx.switchToHttp().getRequest<Record<string, unknown>>();
    return httpReq?.user as CurrentUserPayload;
  },
);
