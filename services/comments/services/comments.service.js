/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const faker = require('faker');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId } = require('../../../utils/func');
const { randomId } = require('../../../utils/func');

const Entity = require('../entities/comment.entity');
const populates = require('../populates');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  mixins: [MongoDbMixin('comments', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates,
  },
  actions: {
    fakeReply: {
      rest: 'GET /fake/reply/:cid',
      params: {
        cid: 'string',
      },
      handler(ctx) {
        console.log('Fake reply', ctx.params);
      },
    },
    fake: {
      rest: 'POST /fake',
      params: {
        num: {
          type: 'number',
          optional: true,
        },
      },
      async handler(ctx) {
        const num = ctx.params.num || 1;

        const data = [];
        const users = await ctx
          .call('users.find', { fields: ['_id'], limit: 1000 })
          .then((res) => res.map((u) => u._id));

        const threads = await ctx
          .call('threads.find', { fields: ['_id'], limit: 1000 })
          .then((res) => res.map((u) => u._id));

        const comments = await ctx
          .call('comments.find', { fields: ['_id'], limit: 1000 })
          .then((res) => res.map((u) => u._id));

        while (data.length < num) {
          data.push(
            ctx.call('comments.create', {
              author: randomId(users.length, users),
              tid: randomId(threads.length, threads),
              cid: randomId(comments.length, comments),
              text: faker.lorem.lines(),
            })
          );
        }
        return Promise.all(data);
      },
    },
  },
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
          usrId = ctx.meta.oauth.user.id;
        } else {
          usrId = ctx.meta.oauth.id;
        }
      }
      return usrId ? ObjectId(usrId) : false;
    },
  },
  hooks: {
    before: {
      // eslint-disable-next-line func-names
      '*': () => {},
      create() {},
      vote() {},
      votes() {},
      list(ctx) {},
      get(ctx) {
        ctx.params.populate = ['author'];
      },
      myStuff() {},
      update() {},
      find() {},
      insert() {},
    },
    after: {
      update() {},
      upvote() {},
      downvote() {},
    },
  },
};
