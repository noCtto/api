import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function moderatorsCount(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; populate: string } }
) {
  this.logger.debug('communities.populates.moderators.count', ctx.params )
  return Promise.all(
    items.map((community: any) =>
      ctx
        .call('moderators.count', {
          ...ctx.params,
          query: {
            target: new ObjectId(community._id),
          },
        })
        .then((moderators) => {
          community.moderators = {
            total: moderators
          };
          return community;
        })
    )
  );
}
