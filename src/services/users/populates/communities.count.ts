import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function communitiesCount(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any}
) {
  console.log('users.populates.communities.count', ctx.params )
  return Promise.all(
    items.map((user: any) =>
      ctx
        .call('communities.count', {
          ...ctx.params,
          query: {
            uid: new ObjectId(user._id),
          },
        })
        .then((communities) => {
          console.log('communities.count', communities)
          
          user.communities = {
            total: communities
          };
          return communities;
        })
    )
  );
}
