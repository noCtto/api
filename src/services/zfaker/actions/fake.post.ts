// import { faker } from '@faker-js/faker';
import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';
export default {
  rest: 'GET /post',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    
    const num = ctx.params.num || 150;
    const users: any = await ctx.call('users.random', { num });
    const communities: any = await ctx.call('communities.random', { num });
    
    const data: any = [];
    while (data.length < num) {
      const post = this.fakePost(
        users[data.length], 
        communities[data.length]
      );
      data.push(ctx.call('posts.create', post ));
    }
    return Promise.all(data);
  },
};
