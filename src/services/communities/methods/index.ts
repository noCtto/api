
import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'
import { externalResource } from '../../../utils/paginate.resource'

export default {
  externalResource,
  async broadcast(this: MicroService, _ctx:Context, event: string, payload: any) {
    try{
      this.broker.broadcast(`communities.${event}`, payload)
    } catch (err) {
      this.logger.error('communities.methods.broadcast.error', err)
    }
  },
  async posts(this: MicroService, ctx:Context, community: string, page: number, limit: number){
    return this.externalResource(ctx, 'posts', { cid: community }, page, limit)
  },
  async subscribers(this: MicroService, ctx:Context, community: string, page: number, limit: number){
    return this.externalResource(ctx, 'subscribers', { cid: community }, page, limit) 
  },
  async subscribed(this: MicroService, _ctx:Context, community: string, user: string){
    return this.adapter.db.collection('subscribers').findOne({ cid: community, uid: user })
  },
  async subscribe(this: MicroService, ctx:Context, community: string, user: string){
    const subscribed = await this.subscribed(ctx, community, user)
    if (subscribed) return subscribed
    return this.adapter.db.collection('subscribers').insertOne({ cid: community, uid: user, createdAt: new Date() })
  },
  async unsubscribe(this: MicroService, ctx:Context, community: string, user: string){
    const subscribed = await this.subscribed(ctx, community, user)
    if (!subscribed) return { msg: 'success' }
    return this.adapter.db.collection('subscribers').deleteOne({ _id: subscribed._id })
  },
  async moderator(this: MicroService, _ctx:Context, community: string, user: string){
    return this.adapter.db.collection('moderators').findOne({ cid: community, uid: user })
  }, 
  async moderators(this: MicroService, ctx:Context, community: string, page: number, limit: number){
    return this.externalResource(ctx, 'moderators', { cid: community }, page, limit)
  },
  async moderate(this: MicroService, ctx:Context, community: string, user: string){
    const moderator = await this.moderator(ctx, community, user)
    if (moderator) return moderator
    return this.adapter.db.collection('moderators').insertOne({ cid: community, uid: user, createdAt: new Date() })
  },
  async unmoderate(this: MicroService, ctx:Context, community: string, user: string){
    const moderator = await this.moderator(ctx, community, user)
    if (moderator) return moderator
    return this.adapter.db.collection('moderators').deleteOne({ _id: moderator._id })
  },
};
