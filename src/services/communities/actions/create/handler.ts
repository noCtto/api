import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type {Params} from './params';
import type { Community } from '@communities/entities';

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
) {
  this.logger.debug('communities.actions.create', ctx.params);
  return this._create(ctx, { ...ctx.params }).then((res: Community)=> {
    this.logger.debug('communities.actions.create.response', res)
    return res
  }).catch((err:any) => {
    this.logger.error('communities.actions.create.error', err)
  });
};
