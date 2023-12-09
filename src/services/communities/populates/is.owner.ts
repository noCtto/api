import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default function author(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  console.log('communities.populates.is.owner', ctx.params )
  const user = this.extractUser(ctx)
  if (!user) {
    return Promise.all(items.map((item:any) => {
      item.owner = false
      return item;
    }))
  }

  return Promise.all(items.map((item:any) => {
    item.owner =  String(user) == String(item.uid)
    return item;
  }))
}
