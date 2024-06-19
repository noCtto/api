
import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'
import { externalResource  } from '@/utils/paginate.resource'

export default {
  externalResource,
  async voters(this: MicroService, _ctx:Context, target: string){
    return this.externalResource('voters', { target, type: 'cid' })
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