import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import { ObjectId } from 'mongodb';

export default function voted(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  return Promise.all(items.map((item: any) => {
    return this.result(ctx, { target: item._id }).then((result:any) => {
      item.result = result;
      return result;
    }).catch((err:any)=> {
      console.error('THIS RESULT ERROR', err)
    })
  }))
}
