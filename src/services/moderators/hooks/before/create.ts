import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

export default async function create(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('moderators.hooks.before.create', ctx.params)
  // const { target } = ctx.params;
  // const community = await ctx.call('communities.get', { id: String(target), fields:['_id'] })
  // const user = await ctx.call('user.get', { id: String(target), fields:['_id'] })
  
  // if (!community && !user) {
  //   return Promise.reject(community)
  // }
}
