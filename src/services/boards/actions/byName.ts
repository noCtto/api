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
      return this._get(ctx, {
        id: ctx.params.board,
        populate: ['posts', 'followers'],
        fields: [
          '_id',
          'name',
          'posts',
          'followers',
          'createdAt',
          'updatedAt',
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
        'name',
        'createdAt',
        'updatedAt',
      ]
    }).then(([board]:any) => board);
  },
};
