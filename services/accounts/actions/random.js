const { randomId } = require('../../../utils/func');

module.exports = {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 1;
    const users = await ctx
      .call('users.find', { fields: ['_id'] })
      .then((res) => res.map((u) => u._id));

    const ids = [];
    const max = users.length;

    while (ids.length < num) {
      ids.push(randomId(max, users));
    }
    return ids;
  },
};
