
import { randomId } from '@utils/func';
import type { Context } from "moleculer";
import { CommentThis } from '../comments.service';

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this:CommentThis, ctx: Context & { params: any }): Promise<string[]> {
    const num = ctx.params.num || 10;
    const tid = ctx.params.tid || null;
    const data = await ctx
      .call('comments.find', { query: { tid: tid.toString() }, fields: ['_id'] })
      .then((res:any) => res.map((item:any) => item._id));
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(data.length, data));
    }
    return ids;
  },
};
