import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

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
    const trending: any = await this.trending(ctx, page, limit);
    if (!trending) return Promise.reject(new Error('no trending posts'));
    return this._list(ctx, { id: { $in: trending }, page, limit, sort: { createdAt: -1 }, populate: ['votes', 'author', 'comments', 'votes'] });
  },
};
