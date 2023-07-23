import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default {
  rest: 'GET /:community',
  async handler(
    this: MicroService,
    ctx: Context & { params: { community: string; populate: string } }
  ) {
    return this._list(ctx, {
      // query: { name: ctx.params.community },
      // populate: ctx.params.populate ? ctx.params.populate.split(',') : [],
    });
  },
};
