const { ObjectId } = require('mongodb');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const ModelMixin = require('../../../mixins/model.mixin');
const { toDeepObjectId, toDeepDate } = require('../../../utils/func');

module.exports = {
  name: 'sessions',
  mixins: [MongoDbMixin('sessions', 'account'), ModelMixin],
  settings: {
    fields: ['_id', 'user', 'token', 'start', 'expires', 'createdAt', 'expired'],
    entityValidator: {
      user: { type: 'object', optional: false },
      start: 'date',
      token: 'string',
      expires: 'date',
      createdAt: 'date',
      expired: { type: 'boolean', default: false },
    },
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
        // console.log(ctx.params);
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
