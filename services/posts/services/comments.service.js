/* eslint-disable no-param-reassign */
const { ValidationError } = require('moleculer').Errors;
const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const faker = require('faker');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId } = require('../../../utils/func');
const { randomId } = require('../../../utils/func');

module.exports = {
  mixins: [MongoDbMixin('comments', 'nocheto')],
  settings: {
    validator: true,
    fields: ['_id', 'tid', 'text', 'cid', 'replies', 'createdAt', 'author', 'votes'],
    entityValidator: {
      tid: {
        type: 'objectID',
        ObjectID: ObjectId,
        optional: true,
      },
      cid: {
        type: 'objectID',
        ObjectID: ObjectId,
        default: null,
        optional: true,
      },
      text: {
        type: 'string',
        required: true,
      },
      createdAt: {
        type: 'date',
        default: dayjs().toDate(),
        required: true,
      },
      author: {
        type: 'objectID',
        ObjectID: ObjectId,
        default: null,
        optional: true,
      },
      votes: {
        type: 'objectID',
        ObjectID: ObjectId,
        default: null,
        optional: true,
      },
    },
    populates: {
      post: {
        action: 'posts.get',
      },
      author: {
        action: 'users.get',
        params: {
          fields: ['_id', 'username', 'photoUrl'],
        },
      },
      votes: {
        action: 'votes.get',
        params: {
          fields: ['_id', 'votes', 'voted', 'count', 'total', 'd'],
          populate: ['voted', 'votes', 'count', 'total'],
        },
      },
      replies: {
        handler(ids, items, handler, ctx) {
          return this.Promise.all(
            items.map((item) =>
              ctx
                .call('comments.list', {
                  query: {
                    cid: ObjectId(item._id),
                  },
                  populate: ['replies', 'author', 'votes', 'voted', 'count'],
                })
                .then((comments) => {
                  item.replies = comments;
                  return item;
                })
            )
          );
        },
      },
    },
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
    create: {
      rest: 'POST /',
      params: {
        tid: {
          type: 'string',
          optional: true,
        },
        cid: {
          type: 'string',
          optional: true,
        },
        text: {
          type: 'string',
          optional: true,
        },
      },
      async handler(ctx) {
        const author = ctx.params.author ? ObjectId(ctx.params.author) : this.extractUser(ctx);
        if (!author) return this.Promise.reject('User not found');

        const params = {
          ...ctx.params,
          author,
        };
        if (!params.cid) {
          delete params.cid;
        }

        const votes = await ctx.call(
          'votes.create',
          toDeepObjectId({
            voters: {
              [author]: 1,
            },
          })
        );

        const comment = await this._create(
          ctx,
          toDeepObjectId({ ...params, votes: ObjectId(votes._id) })
        );
        return comment;
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
