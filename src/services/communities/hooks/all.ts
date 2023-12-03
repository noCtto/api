import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default function all(
  this: MicroService,
  ctx: Context & { params: any }
) {

  ctx.params = {
    ...ctx.params,
    populate: ctx.params?.populate?.split(',') || []
  }
  this.logger.debug('communities.hooks.before.all', ctx.params)  

}
