import { isObjectId } from '@/utils/func';
import type { MicroService } from '@/lib/microservice';
import type { Context } from 'moleculer';

export default async function get(
  this: MicroService,
  ctx: Context & { params: { id: string } }
) {
  this.logger.debug('users.hooks.before', ctx.params)
  if (
    ctx.params.id &&
    !isObjectId(ctx.params.id) &&
    typeof ctx.params.id === 'string'
  ) {
    const query = {
      username: ctx.params.id,
    };
    const exist = await ctx
      .call('users.find', {
        query,
        fields: ['_id'],
      })
      .then(([user]: any) => user);

    if (exist) {
      ctx.params.id = exist._id;
    }
  }
}
