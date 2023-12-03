import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function comments(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(
    items.map((item: any) => {
      return ctx
        .call('comments.list', {
          query: {
            target: new ObjectId(item._id),
            type: 'pid',
          },
          populate: ['replies', 'author', 'votes', 'count', 'total'],
        })
        .then((comments) => {
          item.comments = comments;
          return item;
        });
    })
  );
}
