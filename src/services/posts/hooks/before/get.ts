import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

export default function get(
  this: MicroService,
  ctx: Context & { params?: any }
) {
  this.logger.debug('posts.hooks.before.get', ctx.params )
  ctx.params = {
    ...ctx.params,
    populate: ctx.params?.populate?.split(',') || []
  }
}
