import faker from 'faker';

export default {
  rest: 'POST /fake/vote',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 1;

    const votes = await ctx.call('votes.random', { num });
    const users = await ctx.call('users.random', { num });

    const data: any = [];
    while (data.length < num) {
      
      const params = {
        id: votes[data.length],
        uid: users[data.length],
        d: faker.datatype.boolean(),
      };

      data.push( ctx.call('votes.vote', params) );
    }
    return Promise.all(data);
  },
};
