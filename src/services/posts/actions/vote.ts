import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Post } from '@posts/entities';

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
    return ctx.call('votes.vote', { target: post, d });
  },
};
