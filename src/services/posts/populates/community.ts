import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function community(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  console.log('populating post community =>>> ', _ids, items, _handler, ctx.params);
  return Promise.all(
    items.map((item: any) =>
      ctx
        .call('communities.get', {
          id: item.bid.toString(),
          fields: [
            '_id',
            'name',
            'slug',
            'description',
            'image',
            'icon',
            'banner',
          ],
        })
        .then((data: any) => {
          const o = item;
          o.community = data;
          return o;
        })
    )
  );
}
