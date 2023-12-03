import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default {
  rest: 'GET /:community/all',
  async handler(
    this: MicroService,
    ctx: Context & { params: { community: string } }
  ) {
    this.logger.debug('posts.actions.byCommunity', ctx.params );
  },
};
