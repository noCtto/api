const MongoDbMixin = require('../../../mixins/mongodb.mixin');

const populates = require('../populates');
const actions = require('../actions');
const Entity = require('../entities/thread.entity');
const { extractCompany, extractUser } = require('../../../utils');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  name: 'threads',
  mixins: [MongoDbMixin('threads', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates,
    defaultPopulates: ['total'],
  },
  actions,
  methods: {
    extractCompany,
    extractUser,
  },
};
