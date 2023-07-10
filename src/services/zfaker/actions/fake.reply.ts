import { FakeThis } from '../faker.service';
import type { Context } from 'moleculer';

export default {
  rest: 'GET /reply/:cid',
  params: {
    cid: 'string',
  },
  async handler(this: FakeThis, ctx: Context & { params: any }): Promise<any> {
    console.log('Fake reply', ctx.params);
  },
};
