import { Context, Errors } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import type { Params } from './params'
import { isObjectId } from '@/utils/func';
import type { Community } from '../../entities'

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
) {
  this.logger.debug('communities.actions.byName', ctx.params)
  if (!ctx.params.name) {
    return null;
  }

  if (ctx.params.name === 'all') {
    return this.all();
  }

  if (isObjectId(ctx.params.name)) {
    return this._get(ctx, {
      id: ctx.params.name,
      populate: [
        'posts', 
        'subscribers'
      ],
      fields: [
        '_id',
        'name',
        'posts',
        'subscribers',
        'createdAt',
        'updatedAt',
      ],
    });
  }

    return this._find(ctx, {
      query: { name: { $regex: ctx.params.name } }
    }).then(([community]: [Community]) => {
      if (!community) {
        return null;
      }
      return community;
    }).catch((err: any) => {
      this.logger.error('communities.actions.byName.error:', err)
      return Promise.reject(new Errors.MoleculerError(err.message, 500, 'ERR_FATAL', { err }));

    });
};
