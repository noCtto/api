const faker = require('faker');
const { ObjectId } = require('mongodb');

module.exports = {
  rest: 'GET /fake',
  params: {
    user: {
      type: 'string',
      ObjectId,
      optional: true,
    },
  },
  async handler(ctx) {
    const user = ObjectId(ctx.params.user) || this.extractUser(ctx);
    if (!user) return this.Promise.reject('User not found');

    const template = {
      primary: {
        light: '#4791db',
        main: '#1976d2',
        dark: '#115293',
        contrastText: '#ffffff',
      },
      secondary: {
        light: '#4791db',
        main: '#1976d2',
        dark: '#115293',
        contrastText: '#ffffff',
      },
    };

    return this._create(ctx, {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      icon: faker.image.imageUrl(),
      logo: faker.image.imageUrl(),
      template,
      createdAt: dayjs().toDate(),
      active: true,
      creator: user,
      followers: {
        [String(user)]: true,
      },
    });
  },
};
