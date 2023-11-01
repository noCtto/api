import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default {
  rest: 'GET /all',
  async handler(this: MicroService, ctx: Context) {
    return this._list(ctx, {
      sort: '-createdAt',
      page: 1,
      pageSize: 10,
    });
  },
};
