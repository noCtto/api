/* eslint-disable no-param-reassign */
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId } = require('../../../utils/func');
const Board = require('../entities/board.entity');
const populates = require('../populates');
const actions = require('../actions');
const methods = require('../methods');
const { extractCompany, extractUser } = require('../../../utils');

module.exports = {
  extractCompany,
  extractUser,
};
const { entity: entityValidator, fields } = Board;
module.exports = {
  name: 'boards',
  mixins: [MongoDbMixin('boards', 'nocheto')],
  settings: {
    fields,
    entityValidator,
    populates,
  },
  hooks: {
    before: {
      update(ctx) {
        ctx.params = toDeepObjectId(ctx.params);
      },
    },
  },
  actions,
  methods: {
    ...methods,
    extractCompany,
    extractUser,
  },
};
