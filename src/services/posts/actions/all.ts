import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

type Params = {
  sort?:string,
  page?: number,
  pageSize?: number
  populate?: string,
  fields?: string
}

export default {
  rest: 'GET /all',
  async handler(this: MicroService, ctx: Context<Params>) {
    this.logger.info('posts.actions.all', ctx.params )
    return this._list(ctx, {
      ...ctx.params,
      populate: ["user"],
      sort: '-createdAt',
      page: 1,
      pageSize: 10,
    });
  },
};
