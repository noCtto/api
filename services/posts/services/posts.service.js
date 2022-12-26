/* eslint-disable no-underscore-dangle */
const MongoDbMixin = require('../../../mixins/mongodb.mixin');

const Entity = require('../entities/post.entity');
const actions = require('../actions');
const methods = require('../methods');
const populates = require('../populates');
const hooks = require('../hooks');
const { extractUser } = require('../../../utils');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  mixins: [MongoDbMixin('posts', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates,
  },
  actions,
  methods: {
    ...methods,
    extractUser,
  },
  hooks,
};
