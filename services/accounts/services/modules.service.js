const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const filters = require('../../../utils/filter');

module.exports = {
  name: 'modules',
  mixins: [MongoDbMixin('modules', 'account')],
  settings: {
    fields: [
      '_id',
      'name',
      'description',
      'route',
      'component',
      'endpoint',
      'icon',
      'createdAt',
      'exact',
      'desktop',
      'active',
      'toolbox',
    ],
    entityValidator: {
      name: 'string|min:5',
      description: { type: 'string', optional: true },
      route: 'string',
      component: 'string',
      endpoint: 'string',
      icon: 'string',
      createdAt: 'date',
      exact: { type: 'boolean', default: true },
      desktop: { type: 'boolean', default: false },
      active: { type: 'boolean', default: true },
      toolbox: { type: 'boolean', default: false },
    },
  },
  hooks: {
    before: {
      create(ctx) {
        this.logger.info('Create module');
        ctx.params.createdAt = new Date();
      },
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
};
