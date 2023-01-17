const { randomId } = require('../../../utils');

module.exports = {
  rest: 'POST /bulk/vote',
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

    const votes = await ctx
      .call('votes.find', { fields: ['_id'] })
      .then((res) => res.map((u) => u._id));

    const ids = [];

    while (ids.length < num) {
      ids.push({
        id: randomId(votes.length, votes),
        user: randomId(users.length, users),
      });
    }

    const data = [];
    while (data.length < num) {
      const { id, user } = ids[data.length];

      data.push(
        ctx.call('votes.fake', {
          id,
          user,
        })
      );
    }
    return Promise.all(data);
  },
};
