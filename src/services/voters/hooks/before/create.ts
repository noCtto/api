import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import params from '../../../../utils/params';
export default async function create(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('voters.hooks.before.create', ctx.params)
  return params(ctx)
}
