import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default async function handler(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string; populate: string } }
) {
  return Promise.all(
    items.map((community: any) => {
      return ctx
        .call('subscribers.list', {
          query: {
            target: new ObjectId(community._id),
          },
        })
        .then((subscribers) => {
          community.subscribers = subscribers;
          return community;
        }).catch();
    })
  );
};
