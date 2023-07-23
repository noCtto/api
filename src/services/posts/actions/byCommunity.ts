import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default {
  rest: 'GET /:community/all',
  async handler(
    this: MicroService,
    ctx: Context & { params: { community: string } }
  ) {
    console.log('THIS', ctx.params);
  },
};
