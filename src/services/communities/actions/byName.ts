import { Context, Errors } from 'moleculer';
import type { MicroService } from '@lib/microservice';

const populate: any = ['posts', 'subscribers'];
const fields: any = [
  '_id',
  'name',
  'posts',
  'subscribers',
  'createdAt',
  'updatedAt',
];

export default {
  rest: 'GET /:community',
  params: {
    name: 'string',
    populate: { type: 'string', optional: true },
    fields: { type: 'string', optional: true },
  },
  async handler(
    this: MicroService,
    ctx: Context & {
      params: { 
        name: string; 
        populate: string; 
        fields: string 
      };
    }
  ) {
    if (!ctx.params.name) {
      return null;
    }

    if (ctx.params.name === 'all') {
      return ctx.call('communities.all');
    }
    // check if name is a objectid
    if (ctx.params.name.match(/^[0-9a-fA-F]{24}$/)) {
      return this._get(ctx, {
        id: ctx.params.name,
        populate,
        fields,
      });
    }

      return this._find(ctx, {
        query: { name: { $regex: ctx.params.name } },
        populate: ctx.params.populate ? ctx.params.populate.split(',') : populate,
        fields: ctx.params.fields ? ctx.params.fields.split(',') : fields,
      }).then(([community]: any) => {
        if (!community) {
          return null;
        }
        return community;
      }).catch((err: any) => {

        return Promise.reject(new Errors.MoleculerError(err.message, 500, 'ERR_FATAL', { err }));

      });
  },
};
