import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import { ObjectId } from 'mongodb';

export default function voters(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('votes.populates.voters', ctx.params )
  return Promise.all(items.map((item: any) => {
    return ctx.call('voters.all', {
      pageSize: 3,
      page: 1,
      query: {
        target: new ObjectId(item._id),
      }
    }).then((resp:any) => {
      item.voters = resp;  
      return item
    }).catch((err)=> {
      this.logger.error('votes.populates.voters err:', err)
    })
  }))
}
