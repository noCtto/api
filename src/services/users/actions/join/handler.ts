import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

import type { Params } from './params'

export default async function handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    console.log('users.actions.follow', ctx.params )
  const user = this.extractUser(ctx)
  const { id } = ctx.params;

  const user_target:any = await this._get(ctx, { id })
  this.logger.debug('Target User', user_target)
  if (!user_target) {
    return Promise.reject(Error('Community not found'))
  }

  if (user_target.joined) {
    return Promise.resolve(user_target.joined)
  }

  const join = await ctx.call('subscribers.create', { 
    target: user_target._id,
    uid: user
  })

  return join
}
