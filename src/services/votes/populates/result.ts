import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import { ObjectId } from 'mongodb';

export default function voted(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('votes.populates.count', ctx.params )
  return Promise.all(items.map((item: any) => {
    return ctx.call('voters.find', {
      query: {
        target: new ObjectId(item._id),
      }
    }).then((votes:any) => {
      let positive = 0;
      let negative = 0;

      votes.forEach((vote:any) => {

        if (vote.d == true) {
          positive += 1
        }

        if (vote.d == false) {
          negative += 1
        }

      });

      item.result = positive - negative
      return item


    }).catch((err)=> {
      console.log('THIS ERROR', err)
    })
  }))
}
