import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default {
  rest: 'GET /:id',
  async handler(
    this: MicroService,
    ctx: Context & { params: object }
  ) {
    return this._list(ctx, { ...ctx.params });
  },
};
