
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
    const data = await ctx.call('threads.find', { fields: ['_id'] });
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(data.length, data));
    }
    return ids;
  },
};
