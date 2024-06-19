import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import type {Params} from './params';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
) {
  const uid = this.extractUser(ctx);
  const com = await this._find( ctx, {query: { name: ctx.params.name }})
  if (com && com.length >= 1) return Promise.reject(new MoleculerClientError('', 422, 'communities', 'Community already exists'))

  this.logger.debug('communities.actions.create', ctx.params);
  const { name } = ctx.params 

  try {

    const community = await this._create(ctx, { ...ctx.params, title: name.toLowerCase().replace(' ', '_'), uid })
    this.logger.debug('communities.actions.create.response', community)
    await this.broadcast(ctx,'new', { target: community._id , uid })
    return community

  } catch (err) {
    this.logger.error('communities.actions.create.error', err)
    return Promise.reject(new MoleculerClientError('Something went wrong', 422, 'communities'))

  }
};
