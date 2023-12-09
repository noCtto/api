import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import populate from '../../../../utils/params';
export default function list(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('posts.hooks.before.list', ctx.params )
  return populate(ctx)
}