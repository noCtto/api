const MongoDbMixin = require('../../../mixins/mongodb.mixin');

const Entity = require('../entities/comment.entity');
const populates = require('../populates');
const actions = require('../actions');
const hooks = require('../hooks');
const { extractCompany, extractUser } = require('../../../utils');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  mixins: [MongoDbMixin('comments', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates,
  },
  actions,
  methods: {
    extractCompany,
    extractUser,
  },
  hooks,
};
