import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default async function posts(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; populate: string } }
) {
  this.logger.debug('communities.populates.posts', ctx.params )
  return Promise.all(
    items.map((community: any) =>
      ctx
        .call('posts.list', {
          ...ctx.params,
          query: {
            cid: new ObjectId(community._id),
          },
          populate: ['votes', 'commentsCount'],
          // fields: [
          //   '_id',
          //   'votes',
          //   'author',
          //   'title',
          //   'text',
          //   'body',
          //   'image',
          //   'comments',
          //   'createdAt'
          // ],
        })
        .then((posts) => {
          community.posts = posts;
          return community;
        })
    )
  );
}
