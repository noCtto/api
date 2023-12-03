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
    // const { num } = ctx.params;
    const data: any = [];

    await ctx.call('users.all', { pageSize: 100 }).then((response:any)=> {
      
      const {rows:users} = response;
      
      console.log({users});

      for (const user of users) {
        data.push(ctx.call('users.update', { 
          id: user._id, 
          imageUrl: `https://source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}-${faker.internet.domainWord()}`  
        }));
      }

      return Promise.all(data);
    })

    // while (data.length < num) {
    //   data.push(
    //     ctx.call('users.register', {
    //       username: faker.internet.userName(),
    //       email: faker.internet.email(),
    //       password: '12345678',
    //     })
    //   );
    // }
    // return Promise.all(data);
  },
};
