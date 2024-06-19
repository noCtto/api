import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default function voted(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  const user = this.extractUser(ctx);
  console.log('communities.populates.joined', ctx.params )
  if (!user) return items.map((item:any) => item.joined = false)

  return Promise.all(
    items.map((item: any) => {
      return this.subscribed(ctx, item._id, user).then((subscribed:any) => {
        item.joined = subscribed ? true : false
      }).catch((err:any) => {
        console.error('communities.populates.joined error:', err)
      })
    })
  );
}
