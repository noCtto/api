
import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this:PostThis, ctx: Context & { params: any }): Promise<string[]> {
    const { page, limit } = ctx.params;
    const trending = await ctx.call('votes.trending', { page, limit });
    const posts:any = await ctx.call('posts.find', {
      query: { vid: { $in: trending } },
      fields: [
        '_id',
        'tid',
        'uid',
        'title',
        'text',
        'createdAt',
        'updatedAt',
        'vid',
        'body',
        'comments',
        'votes',
        'author',
      ],
      populate: ['votes', 'author', 'comments', 'votes'],
    });
    console.log('This result is from the service', posts);
    return posts;
  },
};
