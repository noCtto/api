import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function author(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(
    items.map((item: any) =>
      ctx
        .call('accounts.get', {
          id: item.uid.toString(),
          populate: ['gravatar'],
          fields: ['_id', 'username', 'gravatar'],
        })
        .then((data: any) => {
          const o = item;
          o.author = data;
          return o;
        })
    )
  );
}
