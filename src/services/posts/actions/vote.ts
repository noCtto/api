import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Post } from '../entities';

export default {
  rest: 'POST /vote/:id',
  params: {
    id: {
      type: 'string',
      required: true,
    },
    d: {
      type: 'boolean',
      optional: false,
      convert: true,
    },
  },
  async handler(
    this: MicroService,
    ctx: Context & { params: any }
  ): Promise<string[]> {
    const { id, d } = ctx.params;
    const post: Post = await this._get(ctx, { id });
    if (!post) return Promise.reject(new Error('no post'));
    await this.votePost(ctx, post, d);
    return this._get(ctx, { id });
  },
};
