// import { isObjectId } from '@/utils/func';
import type { MicroService } from '../../../../lib/microservice';
import type { Context } from 'moleculer';
import params from '../../../../utils/params';
export default async function get(
  this: MicroService,
  ctx: Context & { params: { id: string } }
) {
  this.logger.debug('users.hooks.before', ctx.params)
  return params(ctx)
}
