import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Vote } from '../../votes/entities'
import type { Post } from '../entities'

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(
    this: MicroService,
    ctx: Context & { params: any }
  ): Promise<Object[]> {
    this.logger.debug('posts.actions.trending', ctx.params )

    const { page, limit } = ctx.params;
    
    const trending: [Vote] = await ctx.call('votes.trending', { page, limit });
    
    const posts: [Post] = await ctx.call('posts.find', {
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
    this.logger.debug('posts.actions.trending', posts );
    return posts;
  },
};
