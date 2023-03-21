import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import { randomId } from '../../../utils/func';
import { FakeThis } from '../faker.service';
import type { Context } from "moleculer";

export default {
  rest: 'GET /fake/board',
  params: {
    user: {
      type: 'string',
      ObjectId,
      optional: true,
    },
  },
  async handler(this:FakeThis, ctx: Context & { params: any }):Promise<any> {
    const num = ctx.params.num || 1;

    const users:any = await ctx.call('users.random', { num });

    const data: any = [];
    while (data.length < num) {
      const user = randomId(users.length, users);
      data.push(
        ctx.call('boards.create', {
          name: `${faker.internet.domainWord()}-${faker.internet.domainWord()}`,
          description: faker.lorem.sentence(),
          banner: `https://source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}`,
          icon: faker.image.imageUrl(),
          logo: faker.image.imageUrl(),
          template: {
            primary: {
              light: faker.internet.color(),
              main: faker.internet.color(),
              dark: faker.internet.color(),
              contrastText: faker.internet.color(),
            },
            secondary: {
              light: faker.internet.color(),
              main: faker.internet.color(),
              dark: faker.internet.color(),
              contrastText: faker.internet.color(),
            },
          },
          createdAt: dayjs().toDate(),
          active: true,
          uid: new ObjectId(user),
          followers: {
            [String(user)]: 1,
          },
        })
      );
    }
    return Promise.all(data);
  },
};
