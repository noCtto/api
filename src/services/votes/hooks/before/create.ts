import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function create(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('votes.hooks.before', ctx.params)
}
