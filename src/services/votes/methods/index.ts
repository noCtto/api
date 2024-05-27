import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'

export default {
  async voted(this: MicroService, _ctx:Context, target: string, uid: string) {
    const voted = await this.adapter.db.collection('voters').findOne({ target, uid });
    if (voted) {
      return voted;
    }
    return false;
  },
  async vote(this: MicroService, ctx: Context, target: string, uid: string, d: boolean) {
    const voted = await this.voted(ctx, target, uid);
    let vote:any = null;
    if (voted) {
      vote = await this.adapter.db.collection('voters').updateOne({ _id: voted._id }, { $set: { d: voted.d == d ? null : d, updatedAt: new Date() } });      
    } else {
      vote = await this.adapter.db.collection('voters').insertOne({ target, uid, d, createdAt: new Date(), updatedAt: new Date() });
    }
    return vote;
  },
  async voters(this: MicroService, _ctx: Context, target: string) {
    return this.adapter.db.collection('voters').find({ target }).toArray();
  },
  async trending(this: MicroService, ctx: Context) {
    const votes = await this.adapter.db.collection('voters').aggregate([
      {
        $group: {
          _id: '$target',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).toArray();
    return this._list(ctx, { query: {$in: votes.map((m:any) => m._id) }, page: 1, limit: 10});
  }
};
