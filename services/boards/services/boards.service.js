/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId } = require('../../../utils/func');
const Board = require('../entities/board.entity');
const populates = require('../populates');
const actions = require('../actions');

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
    extractCompany(ctx) {
      if (ctx.meta.oauth) {
        if (ctx.meta.oauth.company) ctx.params.company = ObjectId(ctx.meta.oauth.company);
        // set company by token
        else if (ctx.meta.oauth.client)
          ctx.params.company = ObjectId(ctx.meta.oauth.client.clientId);
      }
      return ctx.params.company;
    },
    extractUser(ctx) {
      let usrId = null;
      if (ctx.meta.oauth) {
        if (ctx.meta.oauth.user) {
          usrId = ctx.meta.oauth.user._id;
        } else {
          usrId = ctx.meta.oauth.id;
        }
      }
      return ObjectId(usrId);
    },
  },
};
