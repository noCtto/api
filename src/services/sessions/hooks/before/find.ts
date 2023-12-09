// import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import populate from '../../../../utils/params';
export default async function find(
  this: MicroService,
  ctx: Context & { params: any },
  params: any
) {
  this.logger.debug('sessions.hooks.before.find', ctx, params)
  return populate(ctx)
}
