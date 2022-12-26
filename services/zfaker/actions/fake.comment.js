const faker = require('faker');
const { randomId } = require('../../../utils/func');

module.exports = {
  rest: 'POST /fake',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 1;

    const data = [];
    const users = await ctx
      .call('users.find', { fields: ['_id'], limit: 1000 })
      .then((res) => res.map((u) => u._id));

    const threads = await ctx
      .call('threads.find', { fields: ['_id'], limit: 1000 })
      .then((res) => res.map((u) => u._id));

    const comments = await ctx
      .call('comments.find', { fields: ['_id'], limit: 1000 })
      .then((res) => res.map((u) => u._id));

    while (data.length < num) {
      data.push(
        ctx.call('comments.create', {
          author: randomId(users.length, users),
          tid: randomId(threads.length, threads),
          cid: randomId(comments.length, comments),
          text: faker.lorem.lines(),
        })
      );
    }
    return Promise.all(data);
  },
};
