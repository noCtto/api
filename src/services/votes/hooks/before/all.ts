import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default function all(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('votes.hooks.before.all', ctx.params )
  ctx.params = {
    ...ctx.params,
    populate: ctx.params?.populate?.split(',') || []
  }
}
