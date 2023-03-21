
import { randomId } from '../../../utils/func';

import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this:PostThis, ctx:Context & { params: any }):Promise<string[]> {
    const num = ctx.params.num || 10;
    const data = await ctx
      .call('posts.find', { fields: ['_id'] })
      .then((res:any) => res.map((u:any) => u._id));
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(data.length, data));
    }
    return ids;
  },
};
