import type { Context } from 'moleculer';
import extractUser from '../../../utils/extractUser';
import type { MicroService } from '../../../lib/microservice';

export default {
  extractUser,
  async new(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    this.broker.broadcast('new.post', post);
  },
  async community(this:MicroService,_ctx: Context, post: any) : Promise<boolean> {
    return this.adapter.db.collection('communities').findOne({ _id: post._id });
  },
  async thread(this:MicroService,_ctx: Context, _id: string) : Promise<boolean> {
    return this.adapter.db.collection('threads').findOne({ _id });
  },
  async author(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    return this.adapter.db.collection('users').findOne({ _id: post.uid });
  },
  async awards(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    return this.adapter.db.collection('awards').find({ target: post._id }).toArray();
  },
  async comments(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    const aggregate = [
      {
        $match: {
          type: "pid",
          pid: post._id,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: post.page * post.limit,
      },
      {
        $limit: post.limit,
      },
      {
        $project: {
          _id: 1,
          uid: 1,
          pid: 1,
          createdAt: 1,
          content: 1,
        }
      }
    ];
    const result = await this.adapter.db.collection('comments').aggregate(aggregate).toArray();
    return {
      rows: result,
      total: result.length,
      page: post.page,
      pageSize: post.limit,
    }    
  },
  async votes(this:MicroService, _ctx: Context, post: any) : Promise<any> {
    return this.adapter.db.collection('votes').find({ target: post._id }).toArray();
  },
  async vote(this:MicroService, _ctx: Context, post: any, uid:any) : Promise<any> {
    this.broker.broadcast('new.vote', { post, uid });
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
