import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Beritahu TypeScript bahwa request ini adalah objek yang memiliki properti user
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>();

    // Casting tipe kembaliannya agar aman
    return request.user as { userId: string; accountId: string };
  },
);
