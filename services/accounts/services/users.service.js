require('dotenv').config();
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const populates = require('../populates');
const User = require('../entities/user.enity');
const actions = require('../actions');
const methods = require('../methods');
const hooks = require('../hooks');

const { entity: entityValidator, fields } = User;

const { JWT_SECRET } = process.env;

module.exports = {
  name: 'users',
  mixins: [MongoDbMixin('users', 'account')],
  settings: {
    JWT_SECRET,
    fields,
    entityValidator,
    populates,
  },
  hooks,
  actions,
  methods,
};
