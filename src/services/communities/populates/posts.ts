
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function posts(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; page: number, limit: number } }
) {
  this.logger.debug('communities.populates.posts', ctx.params )
  return Promise.all(
    items.map((community: any) =>
      this.posts(ctx, community._id, ctx.params.page || 1, ctx.params.limit || 10)
        .then((posts:any) => {
          community.posts = posts;
          return community;
        })
    )
  );
}
