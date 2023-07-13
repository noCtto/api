import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

const populate: any  = []; // ['posts', 'followers'];
const fields: any = ['_id', 'name', 'posts', 'followers', 'createdAt', 'updatedAt'];

export default {
  rest: 'GET /:board',
  async handler(
    this: MicroService,
    ctx: Context & { params: { name: string; populate: string, fields: string } }
  ) {

    if (!ctx.params.name) {
      return null;
    }

    if (ctx.params.name === 'all') {
      return ctx.call('boards.all');
    }
    // check if name is a objectid
    if (ctx.params.name.match(/^[0-9a-fA-F]{24}$/)) {
      return this._get(ctx, {
        id: ctx.params.name,
        populate,
        fields
      });
    }
    return this._find(ctx, {
      query: {name: { $regex: ctx.params.name }},
      populate: ctx.params.populate ? ctx.params.populate.split(',') : populate,
      fields: ctx.params.fields ? ctx.params.fields.split(',') : fields,
    }).then(([board]: any) => {
      if (!board) {
        return null;
      }
      return board;
    });
  },
};
