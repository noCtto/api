import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default function subscribed(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  const user = this.extractUser(ctx);
  this.logger.debug('users.populates.subscribed', ctx.params )
  if (!user) return items.map((item:any) => item.joined = false)
  return items.map((item: any) => {
    return ctx.call('subscribers.joined', {
      uid: String(user),
      target: String(item._id)
    }).then((subscribed:any) => {
      item.joined = subscribed
    }).catch((err) => {
      console.error('users.populates.joined subscribed:', err)
    })
  });
}
