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
  this.logger.debug('users.populates.moderating', ctx.params )
  return Promise.all(
    items.map((user: any) => {
      return ctx
        .call('moderators.list', {
          query: {
            uid: new ObjectId(user._id),
          },
          populate: 'community',
        }).then((moderating:any) => {
          user.moderating = moderating;
          return moderating;
        })
    })
  );
};
