import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

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
    default: 1,
    convert: true
  },
  pageSize: {
    type: 'number',
    default: 10,
    convert: true
  }
}

export default {
  rest: 'GET /all',
  params,
  async handler(this: MicroService, ctx: Context<Params>) {
    this.logger.debug('posts.actions.all', ctx.params )
    const { page, pageSize }:any = ctx.params;

    const offset = page > 1 ? ((page - 1) * pageSize) : 0

    return this._list( ctx, { ...ctx.params, sort: { createdAt : -1 }, offset });
  },
};
