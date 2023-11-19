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
    const num = ctx.params.num || 15;
        const users: any = await ctx.call('users.random', { num });

        const communities: any = await ctx.call('communities.random', { num });
        if (communities && users) {
          const data: any = [];
          while (data.length < num) {
            this.logger.info('users', users)
            const post = this.fakePost(
              users[data.length], 
              communities[data.length]
            );
            data.push(ctx.call('posts.create', post ));
          }
          return Promise.all(data);
        }
    return null;
  },
};
