import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';

export default {
  rest: 'POST /subscriber',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    const num = ctx.params.num || 100;

    const communities: any = await ctx.call('communities.random', { num });
    const users: any = await ctx.call('users.random', { num });

    const data: any = [];
    while (data.length < num) {
      const params = {
        id: communities[data.length],
        uid: users[data.length],
      };

      data.push(ctx.call('communities.join', params));
    }
    return await Promise.all(data);
  },
};
