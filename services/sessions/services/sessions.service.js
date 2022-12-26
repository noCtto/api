const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const entity = require('../entities/session.entity');
const hooks = require('../hooks');
const actions = require('../actions');

const { entity: entityValidator, fields } = entity;

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
  hooks,
  actions: {
    ...actions,
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
