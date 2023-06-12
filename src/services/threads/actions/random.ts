
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
    const data:any = await ctx.call('threads.find', { fields: ['_id'] });
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(data.length, data));
    }
    return ids;
  },
};
