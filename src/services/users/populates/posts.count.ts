import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function subscribersCount(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('users.populates.posts.count', ctx.params )

  return Promise.all(
    items.map((user: any) =>
      ctx
        .call('posts.count', {
          ...ctx.params,
          query: {
            uid: new ObjectId(user._id),
          },
        })
        .then((posts) => {
          user.posts = {
            total: posts
          };
          return user;
        })
    )
  );
}
