import { faker } from '@faker-js/faker';
import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';

export default {
  rest: 'POST /user',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    const { num } = ctx.params;
    const data: any = [];
    while (data.length < num) {
      data.push(
        ctx.call('accounts.register', {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: '12345678',
        })
      );
    }
    return Promise.all(data);
  },
};
