
import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'

export default {
  async new(this: MicroService, ctx:Context, target: string, uid: string ){
    this.logger.debug('comments.methods.new', ctx.params )
    this.broadcast('comments.new', { target, uid })
  },
  async voters(this: MicroService, _ctx:Context, target: string){
    return this.adapter.db.collection('voters').find({ type: 'cid', target }).toArray()
  },
  async author(this: MicroService, _ctx:Context, target: string){
    return this.adapter.db.collection('users').findOne({ _id: target })
  },
  async replies(this: MicroService, ctx:Context, target: string){
    return this._list(ctx, {
      query: {
        type: 'cid',
        target,
      },
      populate: ['replies', 'author', 'votes', 'voted', 'count'],
      pageSize: 10
    })
  }
}