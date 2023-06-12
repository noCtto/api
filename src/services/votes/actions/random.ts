
import { randomId } from '@utils/func';
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this:MicroService, ctx: Context & { params: any }) {
    const num = ctx.params.num || 10;
    const users = await ctx
      .call('votes.find', { fields: ['_id'] })
      .then((res:any) => res.map((u:any) => u._id));
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(users.length, users));
    }
    return ids;
  },
};
