import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function replies(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('comments.populates.replies', ctx.params )
  return Promise.all(
    items.map((item: any) =>
      ctx
        .call('comments.list', {
          query: {
            type: 'cid',
            target: new ObjectId(item._id),
          },
          populate: ['replies', 'author', 'votes', 'voted', 'count'],
          pageSize: 10
        })
        .then((comments) => {
          if (!comments) {
            item.replies = {
              page: 0,
              pageSize: 1,
              rows: [],
              total: 0,
              totalPages: 0,
            };
          } else {
            item.replies = comments;
          }
          return item;
        })
    )
  );
}
