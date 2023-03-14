
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
    const users = await ctx
      .call('votes.find', { fields: ['_id'] })
      .then((res) => res.map((u) => u._id));
    const ids:any = [];
    while (ids.length < num) {
      ids.push(randomId(users.length, users));
    }
    return ids;
  },
};
