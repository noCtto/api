import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default {
  rest: 'GET /fetch-session',
  cache: false,
  async handler(this: MicroService, ctx: Context & { meta: any }) {
    this.logger.debug('sessions.actions.fetch', ctx.params )
    const query = {
      user: ctx.meta.oauth ? new ObjectId(ctx.meta.oauth.user.id) : '',
    };
    return ctx
      .call('sessions.find', { query, sort: '-createdAt' })
      .then((r: any) => {
        const expires = new Date(r[0].expires);
        return { ...r[0], expires: expires.getTime() };
      });
  },
};
