import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function handler(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('users.populates.comments', ctx.params )
  return Promise.all(
    items.map((user: any) => {
      return ctx
        .call('comments.list', {
          query: {
            uid: new ObjectId(user._id),
          },
          pageSize: 10,
        })
        .then((comments) => {
          user.comments = comments;
          return comments;
        })
    })
  );
};
