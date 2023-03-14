export default {
  rest: 'GET /fake/follow/',
  params: {
    id: {
      type: 'string',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 1;

    const users = await ctx.call('users.random', { num: num * 2 });
    const data: any = [];
    while (data.length < num) {
      const uid1 = users.shift();
      const uid2 = users.pop();
      data.push(
        ctx.call('users.follow', {
          uid1,
          uid2,
        })
      );
    }
    return Promise.all(data);
  },
};
