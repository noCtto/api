
import { randomId } from '../../../utils/func';

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 10;
    const tid = ctx.params.tid || null;
    const data = await ctx
      .call('comments.find', { query: { tid: tid.toString() }, fields: ['_id'] })
      .then((res) => res.map((item) => item._id));
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(data.length, data));
    }
    return ids;
  },
};
