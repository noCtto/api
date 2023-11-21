import { faker } from '@faker-js/faker';
import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';

export default {
  rest: 'POST /vote',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    const num = ctx.params.num || 100;

    const votes: any = await ctx.call('votes.random', { num });
    const users: any = await ctx.call('users.random', { num });

    const data: any = [];
    while (data.length < num) {
      console.log('faking vote', data.length)
      const params = {
        id: votes[data.length],
        uid: users[data.length],
        d: faker.datatype.boolean(),
      };

      data.push(ctx.call('votes.vote', params));
    }
    return Promise.all(data);
  },
};
