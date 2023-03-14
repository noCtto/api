
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
    const data = await ctx
      .call('posts.find', { fields: ['_id'] })
      .then((res) => res.map((u) => u._id));
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(data.length, data));
    }
    return ids;
  },
};
