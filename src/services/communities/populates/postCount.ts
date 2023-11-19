import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function postsCount(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; populate: string } }
) {
  this.logger.debug('communities.populates.postCount', ctx.params)
  return Promise.all(
    items.map((community: any) =>
      ctx
        .call('posts.count', {
          ...ctx.params,
          query: {
            cid: new ObjectId(community._id),
          },
        })
        .then((count:any) => {
          community.posts = count;
          return community;
        })
    )
  );
}
