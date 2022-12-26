const { ObjectId } = require('mongodb');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId, toDeepDate } = require('../../../utils/func');
const Session = require('../entities/session.entity');

const { entity: entityValidator, fields } = Session;

module.exports = {
  name: 'sessions',
  mixins: [MongoDbMixin('sessions', 'account')],
  settings: {
    fields,
    entityValidator,
    populates: {
      userId: 'users.get',
    },
  },
  hooks: {
    before: {
      async find(ctx) {
        if (ctx.params.query.user) {
          ctx.params.query.user = ObjectId(ctx.params.query.user);
        }
      },
    },
  },
  actions: {
    updateOne: {
      params: {
        filter: 'object',
        project: 'object',
      },
      handler(ctx) {
        const { filter, project } = ctx.params;
        return this.adapter.collection.updateOne(
          toDeepObjectId(filter),
          toDeepObjectId(toDeepDate(project))
        );
      },
    },
    fetchSession: {
      rest: 'GET /fetch-session',
      cache: false,
      async handler(ctx) {
        const query = {
          user: ctx.meta.oauth ? ObjectId(ctx.meta.oauth.user.id) : '',
        };
        // Regresr la session mas reciente.
        return ctx.call('sessions.find', { query, sort: '-createdAt' }).then((r) => {
          const expires = new Date(r[0].expires);
          // const localTime = (expires.getTime() / 1000 - 25200) * 1000;

          return { ...r[0], expires: expires.getTime() };
        });
      },
    },
    test: {
      params: {
        name: 'string',
      },
      /** @param {Context} ctx  */
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`;
      },
    },
  },
};
