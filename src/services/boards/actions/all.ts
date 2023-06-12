import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';


export default {
  rest: 'GET /:board',
  async handler(this:MicroService, ctx: Context & { params: { board: string, populate: string } }) {
    
    return this._list(ctx, {
      // query: { name: ctx.params.board },
      // populate: ctx.params.populate ? ctx.params.populate.split(',') : [],
    })
  },
}
