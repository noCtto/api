import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import populate from '../../../../utils/params';
export default function get(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('comments.hooks.before.get', ctx.params)
  return populate(ctx)
}
