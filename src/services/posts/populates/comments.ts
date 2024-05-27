import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function comments(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(
    items.map((item: any) => {
      return this.comments(ctx, { id: new ObjectId(item._id), page: 1, limit: 10})
        .then((comments:any) => {
          item.comments = comments;
          return item;
        });
    })
  );
}
