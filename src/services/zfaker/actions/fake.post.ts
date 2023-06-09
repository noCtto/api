
import { faker } from '@faker-js/faker';
import { FakeThis } from '../faker.service';
import type { Context } from "moleculer";
export default {
  rest: 'POST /post',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this:FakeThis, ctx: Context & { params: any }):Promise<any> {
    const num = ctx.params.num || 1;
    const users:any = await ctx.call('accounts.random', { num });
    const boards:any = await ctx.call('boards.random', { num });
    
    if (boards && users) {
      const data: any = [];
      while (data.length < num) {
        data.push(
          ctx.call('posts.create', {
            author: users[data.length],
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph(),
            image: `https://source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}-${faker.internet.domainWord()}`,
            bid: boards[data.length],
          })
        );
      }
      return Promise.all(data);
    }
    return null;
  },
};
