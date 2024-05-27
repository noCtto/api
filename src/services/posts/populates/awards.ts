import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function awards(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(
    items.map((item: any) => {
      return this.awards(ctx, { post: new ObjectId(item._id) })
        .then((awards:any) => {
          item.awards = awards;
          return item;
        });
    })
  );
}
