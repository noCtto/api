import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default function thread(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(
    items.map((item: any) =>
      this.thread(ctx, { _id: item.tid })
        .then((data: any) => {
          const o = item;
          o.thread = data;
          return o;
        })
    )
  );
}
