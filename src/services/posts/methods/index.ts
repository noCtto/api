import type { Context } from 'moleculer';
import extractUser from '../../../utils/extractUser';
import type { MicroService } from '../../../lib/microservice';
import { externalResource } from '@/utils/paginate.resource';
export default {
  extractUser,
  externalResource,
  async new(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    this.broker.broadcast('new.post', post);
  },
  async community(this:MicroService,_ctx: Context, post: any) : Promise<boolean> {
    return this.adapter.db.collection('communities').findOne({ _id: post._id });
  },
  async author(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    return this.adapter.db.collection('users').findOne({ _id: post.uid });
  },
  async awards(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    return this.externalResource('awards', { target: post._id });
  },
  async comments(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    return this.externalResource('comments', { target: post._id });   
  },
  async votes(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    const card = this.adapter.db.collection('votes').find({ target: post._id }).toArray();
    const voters = this.externalResource('voters', { target: card._id });
    card.voters = voters;
    return card;
  },
  async trending(this:MicroService, ctx: Context, page: number, limit: number) : Promise<any> {
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
    const posts = votes.map((vote: any) => vote._id);
    return this._list(ctx, { id: { $in: posts }, page, limit, sort: { createdAt: -1 }, populate: ['votes', 'author', 'comments', 'votes'] });
  }
};
