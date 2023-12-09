import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function handler(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; populate: string } }
) {
  console.log('communities.populates.moderators', ctx.params);
  return Promise.all(
    items.map((community: any) => {
      return ctx
        .call('moderators.list', {
          query: {
            target: new ObjectId(community._id),
          },
        })
        .then((moderators) => {
          console.log('This is the moderators', moderators)
          community.moderators = moderators;
          return community;
        });

    })
  );
};
