import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default function author(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  console.log('posts.populates.isAuthor', ctx.params )
  const user = this.extractUser(ctx)
  if (!user) {

    return Promise.all(items.map((item:any) => {
      item.isAuthor = false
      return item;
    }))
  }

  return Promise.all(items.map((item:any) => {
    item.isAuthor =  String(user) == String(item.uid)
    return item;
  }))
}
