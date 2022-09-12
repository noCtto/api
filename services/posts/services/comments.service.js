/* eslint-disable no-param-reassign */
const { ValidationError } = require('moleculer').Errors;
const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const faker = require('faker');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId } = require('../../../utils/func');

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
      replies: {
        type: 'object',
        optional: true,
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
      rest: 'GET /fake/:tid',
      params: {
        tid: 'string',
      },
      async handler(ctx) {
        const user = this.extractUser(ctx);
        const paragraph = faker.fake('{{lorem.paragraph}}');
        const thread = await ctx.call('threads.find', { tid: ctx.params.tid });
        if (!thread) {
          return 'thread not found';
        }

        const comment = await this._create(ctx, {
          tid: ObjectId(thread[0]._id),
          text: paragraph,
          createdAt: dayjs().toDate(),
          author: user,
        });
        console.log('New Comment created', comment);

        const votes = await ctx.call('votes.create', {
          type: 'comment',
          parent: ObjectId(comment._id),
          createdAt: dayjs().toDate(),
          voters: {
            [user]: true,
          },
        });
        console.log('New Votes created', votes);

        return this._update(ctx, {
          _id: ObjectId(comment._id),
          votes: ObjectId(votes._id),
        });
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
        const user = this.extractUser(ctx);
        if (!user) return this.Promise.reject(new ValidationError('no user'));
        const params = {
          ...ctx.params,
          author: user,
        };
        if (!params.cid) {
          delete params.cid;
        }

        const comment = await this._create(ctx, toDeepObjectId(params));
        const votes = await ctx.call(
          'votes.create',
          toDeepObjectId({
            voters: {
              [user]: 1,
            },
          })
        );

        return this._update(ctx, { id: comment._id, votes: ObjectId(votes._id) });
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
