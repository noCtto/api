import { randomId } from '../../../utils/func';
import { faker } from '@faker-js/faker';
import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';

export default {
  rest: 'POST /comment',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    const num = ctx.params.num || 250;

    const users: any = await ctx.call('users.random', { num });
    // const _posts:any = await ctx.call('posts.random', { num });
    const comments:any = await ctx.call('comments.random', { num });

    const data:any = []
    while (data.length < (num)) {  
      const comment = {
        uid: randomId(users.length, users),
        target: randomId(comments.length, comments),
        type: 'pid',
        text: faker.lorem.lines(),
      };
      data.push(ctx.call('comments.create', comment));
    }
    return Promise.all(data);
  },
};
