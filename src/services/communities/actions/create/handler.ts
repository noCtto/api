import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import type {Params} from './params';
import type { Community } from '../../entities';

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

  return this._create(ctx, { ...ctx.params, title: name.toLowerCase().replace(' ', '_'), uid }).then((res: Community)=> {
    this.logger.debug('communities.actions.create.response', res)
    return res
  }).catch((err:any) => {
    this.logger.error('communities.actions.create.error', err)
    return Promise.reject(new MoleculerClientError('Something went wrong', 422, 'communities'))
  });
};
