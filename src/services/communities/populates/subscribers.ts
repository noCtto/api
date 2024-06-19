import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function handler(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: { community: string, page:number, limit:number } }
) {
  return Promise.all(
    items.map((community: any) => {
      return this.subscribers(ctx, community._id, ctx.params.page || 1 , ctx.params.limit || 10 )
        .then((subscribers:any) => {
          community.subscribers = subscribers;
          return community;
        }).catch();
    })
  );
};
