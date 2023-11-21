import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default async function create(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('voters.hooks.before.create', ctx.params)
  // const { target } = ctx.params;
  // const exists = await ctx.call('communities.get', { id: String(target), fields:['_id'] })
  // if (!exists) {
  //   return Promise.reject(exists)
  // }
}
