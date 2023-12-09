import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import populate from '../../../../utils/params';
export default function all(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('votes.hooks.before.all', ctx.params )
  return populate(ctx)
}
