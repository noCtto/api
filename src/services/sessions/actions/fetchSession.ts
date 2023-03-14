
import { ObjectId } from 'mongodb';

export default {
  rest: 'GET /fetch-session',
  cache: false,
  async handler(ctx) {
    const query = {
      user: ctx.meta.oauth ? new ObjectId(ctx.meta.oauth.user.id) : '',
    };
    // Regresr la session mas reciente.
    return ctx.call('sessions.find', { query, sort: '-createdAt' }).then((r) => {
      const expires = new Date(r[0].expires);
      // const localTime = (expires.getTime() / 1000 - 25200) * 1000;

      return { ...r[0], expires: expires.getTime() };
    });
  },
};
