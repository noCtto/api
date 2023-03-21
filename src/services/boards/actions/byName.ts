import type { Context } from "moleculer";
import { BoardThis } from '../boards.service';


export default {
  rest: 'GET /:board',
  async handler(this:BoardThis, ctx: Context & { params: { board: string, populate: string } }) {
    return this._find(ctx, {
      query: { name: ctx.params.board },
      populate: ctx.params.populate ? ctx.params.populate.split(',') : [],
    }).then(([board]:any) => board);
  },
};
