import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

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
  rest: 'GET /',
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    return this._list(ctx, { ...ctx.params });
  },
};
