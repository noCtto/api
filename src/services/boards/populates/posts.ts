import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function posts(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { board: string; populate: string } }
) {
  return Promise.all(
    items.map((board: any) =>
      ctx
        .call('posts.list', {
          ...ctx.params,
          query: {
            bid: new ObjectId(board._id),
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
          board.posts = posts;
          return board;
        })
    )
  );
}
