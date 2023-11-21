import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function voted(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('votes.populates.voted', ctx.params )
  const user = this.extractUser(ctx);

  if (!user) return items.map((item:any) => item.voted = false)

  return Promise.all(items.map((item: any) => {
    return ctx.call('voters.voted', { 
      target: item._id, 
      uid: String(user) 
    }).then((voted:any) => {
      item.voted = voted
      return item
    })
  }))
}
