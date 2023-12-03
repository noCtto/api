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
  console.log('users.populates.wallet', ctx.params )
  return Promise.all(
    items.map((user: any) => {
      return ctx
        .call('wallets.find', {
          query: {
            uid: new ObjectId(user._id),
          },
        })
        .then((wallets:any) => {
          if (!wallets.length) {
            return ctx.call('wallets.create', { uid: user._id })
          }
          user.wallet = wallets[0];
          return user;

        })
    })
  );
};
