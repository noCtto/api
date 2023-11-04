import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

type Params = {
  sort?:string,
  page?: number,
  pageSize?: number
  populate?: string,
  fields?: string
}

const params = {
  page: {
    type: "number",
    default: 1
  },
  pageSize: {
    type: 'number',
    default: 10,
  }
}

export default {
  rest: 'GET /all',
  params,
  async handler(this: MicroService, ctx: Context<Params>) {
    this.logger.info('posts.actions.all', ctx.params )
    return this._list(ctx, { ...ctx.params });
  },
};
