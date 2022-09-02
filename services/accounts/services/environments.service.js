const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const filters = require('../../../utils/filter');

module.exports = {
  name: 'environments',
  mixins: [MongoDbMixin('environments', 'account')],
  settings: {
    fields: ['_id', 'name', 'description', 'createdAt', 'active'],
    entityValidator: {
      name: 'string|min:5',
      description: { type: 'string', optional: true },
      createdAt: 'date',
      active: { type: 'boolean', default: true },
    },
  },
  hooks: {
    before: {
      list(ctx) {
        if (!ctx.params.query) ctx.params.query = {};
        ctx.params.query.active = true;
      },
    },
    after: {
      list(ctx, res) {
        return filters.list(ctx, res);
      },
    },
  },
  actions: {
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
