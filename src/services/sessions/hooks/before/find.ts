// import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function find(
  this: MicroService,
  ctx: Context & { params: any },
  params: any
) {
  this.logger.debug('sessions.hooks.before.find', ctx, params)
  // if (ctx?.params?.query?.user) {
  //   try {
  //     ctx.params.query._id = new ObjectId(ctx.params.query.user);
  //   } catch (err) {
  //     console.warn('sessions.hooks.before.find using _id', err)
  //   }
  //   try {
  //     ctx.params.query.username = ctx.params.query.user;
  //   } catch (err) {
  //     console.warn('sessions.hooks.before.find regular string', err)
  //   }
  // }
}
