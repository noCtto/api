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
  return Promise.all(
    items.map((item:any) => {
      return ctx.call('users.get', { id: String(item.uid) })
        .then((user:any) => {
          item.owner = user;
          return item;
        })
    }) 
  )
}
