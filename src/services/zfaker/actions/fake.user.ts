
import faker from 'faker';

export default {
  rest: 'POST /fake/user',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const { num } = ctx.params;
    const data: any = [];
    while (data.length < num) {
      data.push(
        ctx.call('users.register', {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: '12345678',
        })
      );
    }
    return Promise.all(data);
  },
};
