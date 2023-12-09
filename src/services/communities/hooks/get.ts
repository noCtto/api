import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import params from '../../../utils/params';

export default function get(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('communities.hooks.before.get', ctx.params)  
  // if (ctx.params?.populate) {
  //   ctx.params = get_params(ctx)
  // }
  return params(ctx)
}
