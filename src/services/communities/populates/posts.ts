import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function posts(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; populate: string } }
) {
  return Promise.all(
    items.map((community: any) =>
      ctx
        .call('posts.list', {
          ...ctx.params,
          query: {
            bid: new ObjectId(community._id),
          },
          populate: ['author', 'comments'],
          fields: [
            '_id',
            'votes',
            'author',
            'title',
            'text',
            'image',
            'comments',
          ],
        })
        .then((posts) => {
          community.posts = posts;
          return community;
        })
    )
  );
}
