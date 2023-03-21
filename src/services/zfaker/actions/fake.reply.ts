import { toDeepObjectId } from '../../../utils/func';
import { randomId } from '../../../utils/func';
import { faker } from '@faker-js/faker';
import { FakeThis } from '../faker.service';
import type { Context } from "moleculer";

export default {
  rest: 'GET /fake/reply/:cid',
  params: {
    cid: 'string',
  },
  async handler(this:FakeThis, ctx: Context & { params: any }):Promise<any> {
    console.log('Fake reply', ctx.params);
  },
};
