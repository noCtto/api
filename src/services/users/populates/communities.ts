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
  this.logger.debug('users.populates.communities', ctx.params )
  return Promise.all(
    items.map((user: any) => {
      return ctx
        .call('communities.list', {
          query: {
            uid: new ObjectId(user._id),
          },
        })
        .then((communities) => {
          user.communities = communities;
          return communities;
        })
    })
  );
};
