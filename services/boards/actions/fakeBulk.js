module.exports = {
  rest: 'GET /fake/bulk',
  async handler(ctx) {
    const num = 15;
    const users = await ctx.call('users.find', { fields: ['_id'] });
    const ids = [];
    const max = users.length;
    // eslint-disable-next-line no-plusplus
    const randomUser = () => {
      const r = Math.floor(Math.random() * (max - 0 + 1) + 0);
      try {
        return users[r]._id;
      } catch (err) {
        return randomUser();
      }
    };
    while (ids.length < num) {
      ids.push(randomUser());
    }

    const data = [];
    while (data.length < num) {
      data.push(ctx.call('boards.fake', { user: ids[data.length] }));
    }
    return Promise.all(data);
  },
};
