
import type { MicroService } from '~/src/lib/microservice'
import type { Context } from 'moleculer'
import { ObjectId } from 'mongodb'
export default {
  subscribed(this: MicroService, ctx:Context  ,target: string, uid: string) {

    this.logger.debug('subscribers.methods.subscribed', ctx.params, target, uid )

    return this._find(ctx, { 
      query: {
        target: new ObjectId(target),
        uid: new ObjectId(uid)
      } 
    }).then(([sub]:any) => {
      if (sub) {
        return true
      }; 
      return false
    })
  }
}