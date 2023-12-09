import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

import populate from '../../../../utils/params';

export default async function create(
  this: MicroService,
  ctx: Context & { params: any }
) {
  this.logger.debug('moderators.hooks.before.create', ctx.params)
  return populate(ctx)
}
