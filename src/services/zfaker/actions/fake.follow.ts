import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';

export default {
  rest: 'GET /follow/',
  params: {
    id: {
      type: 'string',
      optional: true,
    },
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    const num = ctx.params.num || 1;

    const users: any = await ctx.call('users.random', { num: num * 2 });
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
