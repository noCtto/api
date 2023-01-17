const faker = require('faker');
const { randomId } = require('../../../utils/func');

module.exports = {
  rest: 'POST /fake/post',
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

    const data = [];
    while (data.length < num) {
      data.push(
        ctx.call('posts.create', {
          author: ids[data.length],
          // title: faker.lorem.sentence(),
          body: faker.lorem.paragraph(),
          // image: faker.image.imageUrl(),
        })
      );
    }
    return Promise.all(data);
  },
};
