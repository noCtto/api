import type { Context } from "moleculer";
import { BoardThis } from '../boards.service';


export default {
  rest: 'GET /:board',
  async handler(this:BoardThis, ctx: Context & { params: { board: string, populate: string } }) {
    if (ctx.params.board === 'all') {
      return ctx.call('boards.all');
    }
    // check if name is a objectid
    if (ctx.params.board.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(
        'THIS ById',
        ctx.params,
      )
      return this._get(ctx, {
        id: ctx.params.board,
        populates: ['posts','post', 'followers'],
        fields: [
          '_id',
          'name',
        ]
      });
    }
    
    console.log('This', this);
    console.log('CTX', ctx);
    
    return this._find(ctx, {
      query: { name: ctx.params.board },
      populate: ['posts', 'followers'],
      fields: [
        '_id',
        'name',
        'posts',
        'followers',
      ]
    }).then(([board]:any) => board);
  },
};
