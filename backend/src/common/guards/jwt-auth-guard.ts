import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { isObservable, lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Override getRequest agar Passport bisa mengekstrak JWT
   * dari request baik di konteks REST maupun GraphQL.
   */
  getRequest(context: ExecutionContext): Request {
    const ctxType = context.getType();
    if ((ctxType as string) === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext<{ req: Request }>();
      return ctx.req;
    }
    return context.switchToHttp().getRequest<Request>();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      try {
        const result = super.canActivate(context);
        if (isObservable(result)) {
          await lastValueFrom(result);
        } else if (result instanceof Promise) {
          await result;
        }
      } catch {
        // Ignore auth error for public routes
      }
      return true;
    }
    const result = super.canActivate(context);
    if (result instanceof Promise) {
      return result;
    }
    return result as boolean;
  }
}
