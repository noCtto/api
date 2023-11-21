import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default async function handler(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(
    items.map((user: any) => {
      return ctx
        .call('subscribers.list', {
          query: {
            target: new ObjectId(user._id),
          },
        })
        .then((subscribers) => {
          user.subscribers = subscribers;
          return user;
        }).catch();
    })
  );
};
