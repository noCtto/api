import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default {
  rest: 'GET /all',
  async handler(
    this: MicroService,
    ctx: Context & { params: Object }
  ) {
    return this._list(ctx, { ...ctx.params });
  },
};
