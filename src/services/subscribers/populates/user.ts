import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function awards(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  console.log('subscribers.populates.user', ctx.params )
  return Promise.all(
    items.map((item: any) => {
      return ctx
        .call('users.get', {
          id: String(item.uid),
          fields: ['_id', 'username', 'imageUrl']
        })
        .then((user) => {
          item.user = user;
          return item;
        });
    })
  );
}
