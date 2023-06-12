
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default {
  rest: 'POST /vote',
  params: {
    id: {
      type: 'string',
      required: true,
    },
  },
  async handler(this:MicroService, ctx: Context & { params: any }): Promise<string[]> {
    const { id, d } = ctx.params;
    const comment = await this._get(ctx, { id });
    if (!comment) return Promise.reject(new Error('no comment'));
    return ctx.call('votes.vote', { id: comment.vid, d });
  },
};
