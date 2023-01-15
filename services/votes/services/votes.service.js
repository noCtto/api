const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const populates = require('../populates');
const actions = require('../actions');
const methods = require('../methods');
const hooks = require('../hooks');
const Entity = require('../entities/votes.entity');
const { extractUser } = require('../../../utils');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  mixins: [MongoDbMixin('votes', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates,
  },
  actions,
  hooks,
  methods: {
    ...methods,
    extractUser,
  },
};
