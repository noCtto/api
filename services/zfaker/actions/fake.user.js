const faker = require('faker');

module.exports = {
  rest: 'POST /fake',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const { num } = ctx.params;
    return this.Promise.all(
      [...Array(num || 1)].map(() =>
        this.actions
          .register({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: '12345678',
          })
          .then((user) => ({
            msg: 'welcome',
            user,
          }))
      )
    );
  },
};
