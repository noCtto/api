
import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'
import { ObjectId } from 'mongodb'

export default {
  given(this: MicroService, ctx:Context , target: string, uid: string) {
    this.logger.debug('awards.methods.given', ctx.params, target, uid )
    return this._find(ctx, { 
      query: {
        target: new ObjectId(target),
        uid: new ObjectId(uid)
      } 
    })
  },
  async catalog(this: MicroService, ctx:Context, type: string){
    this.logger.debug('awards.methods.catalog', ctx.params )
    return this.adapter.db.collection('awards-catalog').find({ type }).toArray()
  },
  async wallet(this: MicroService, ctx:Context, uid: ObjectId){
    this.logger.debug('awards.methods.wallet', ctx.params )
    return this.adapter.db.collection('wallets').findOne({ uid })
  },
  async price(this: MicroService, ctx:Context, award: ObjectId){
    this.logger.debug('awards.methods.price', ctx.params )
    return this.adapter.db.collection('awards-catalog').findOne({ _id: award }).price
  },
  async afford(this: MicroService, ctx:Context, uid: ObjectId, award: ObjectId){
    const wallet = await this.wallet(ctx, uid)
    const price = await this.price(ctx, award)
    return wallet.balance >= price
  },
  async buy(this: MicroService, ctx:Context, uid: ObjectId, award: ObjectId){
    const price = await this.price(ctx, award)
    return this.adapter.db.collection('wallets').updateOne({ uid }, { $inc: { balance: -price }})
  }
}