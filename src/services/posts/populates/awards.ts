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
  console.log('posts.populates.awards', ctx.params )
  return Promise.all(
    items.map((item: any) => {
      return ctx
        .call('awards.list', {
          query: {
            target: new ObjectId(item._id),
          },
          populate: ['types'],
          pageSize: 138,
          page: 1,
        })
        .then((awards) => {
          item.awards = awards;
          return item;
        });
    })
  );
}
