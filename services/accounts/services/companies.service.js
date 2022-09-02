const fetch = require('node-fetch');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const ModelMixin = require('../../../mixins/model.mixin');
const { aeach, parseOperator, toDeepObjectId } = require('../../../utils/func');

module.exports = {
  name: 'companies',
  mixins: [MongoDbMixin('companies', 'account'), ModelMixin],
  settings: {
    fields: ['_id', 'number', 'name'],
    entityValidator: {
      name: 'string|min:5',
      siteUrl: { type: 'string', optional: true },
      active: { type: 'boolean', default: true },
      logo: { type: 'string', optional: true },
      icon: { type: 'string', optional: true },
    },
  },
  hooks: {
    before: {
      async list(ctx) {
        if (!ctx.params.query) ctx.params.query = {};

        let filters = ctx.params.filter || [];
        if (typeof filters === 'string') filters = JSON.parse(filters);

        await aeach(filters, async (obj) => {
          if (String(obj.c).includes('.')) {
            const [collection, field] = String(obj.c).split('.');

            const inArray = await ctx.call(`${collection}.find`, {
              query: {
                [field]: parseOperator(obj.o, obj.v),
              },
              fields: ['_id'],
            });

            ctx.params.query[collection] = {
              $in: inArray.map((r) => ObjectId(r._id)),
            };
          } else {
            ctx.params.query[obj.c] = parseOperator(obj.o, obj.v);
          }
        });

        ctx.params.query.active = true;
      },
      update(ctx) {
        ctx.params = toDeepObjectId(ctx.params);
      },
    },
  },
  actions: {},
  methods: {
    extractCompany(ctx) {
      let companyId = null;
      if (ctx.meta.oauth) {
        if (ctx.meta.oauth.company) companyId = ObjectId(ctx.meta.oauth.company);
        else if (ctx.meta.oauth.client) companyId = ObjectId(ctx.meta.oauth.client.clientId);
      }

      if (ctx.params.company) companyId = ObjectId(ctx.params.company);

      return companyId;
    },
  },
};
