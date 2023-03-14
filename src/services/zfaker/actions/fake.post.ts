
import faker from 'faker';

export default {
  rest: 'POST /fake/post',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 1;
    const users = await ctx.call('users.random', { num });
    const boards = await ctx.call('boards.random', { num });
    if (boards && users) {
      const data: any = [];
      while (data.length < num) {
        data.push(
          ctx.call('posts.create', {
            author: users[data.length],
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph(),
            image: `https://source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}-${faker.internet.domainWord()}`,
            bid: boards[data.length],
          })
        );
      }
      return Promise.all(data);
    }
    return null;
  },
};
