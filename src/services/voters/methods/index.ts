
import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'
import { ObjectId } from 'mongodb'
export default {
  voted(this: MicroService, ctx:Context  ,target: string, uid: string) {
    this.logger.debug('voters.methods.voted', ctx.params, target, uid )
    return this._find(ctx, { 
      query: {
        target: new ObjectId(target),
        uid: new ObjectId(uid)
      } 
    }).then(([sub]:any) => {
      if (sub) {
        return sub
      }; 
      return false
    })
  }
}