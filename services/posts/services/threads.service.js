/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');

module.exports = {
  name: 'threads',
  mixins: [MongoDbMixin('threads', 'nocheto')],
  settings: {
    validator: true,
    fields: ['_id', 'post', 'comments'],
    entityValidator: {
      post: {
        type: 'objectID',
        ObjectID: ObjectId,
      },
      comments: {
        type: 'array',
        optional: true,
        default: [],
      },
    },
    populates: {
      post: {
        action: 'posts.get',
      },
      comments: {
        handler(ids, items, handler, ctx) {
          return this.Promise.all(
            items.map((item) =>
              ctx
                .call('comments.list', {
                  query: {
                    tid: ObjectId(item._id),
                    cid: { $exists: false },
                  },
                  populate: ['replies', 'author', 'votes', 'voted', 'count', 'total'],
                })
                .then((comments) => {
                  item.comments = comments;
                  return item;
                })
            )
          );
        },
      },
    },
    defaultPopulates: ['total'],
  },
  actions: {
    fake: {
      rest: 'GET /fake/:tid',
      params: {
        tid: 'string',
      },
      async handler(ctx) {
        const thread = await ctx.call('threads.find', { tid: ctx.params.tid });
        if (!thread) {
          return 'thread not found';
        }
        return thread;
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
      return ObjectId(usrId);
    },
  },
  hooks: {
    before: {
      // eslint-disable-next-line func-names
      '*': (ctx) => {
        // ctx.params = toDeepObjectId(ctx.params);
      },
      create() {},
      vote() {},
      votes() {},
      list() {},
      // get(ctx) {
      //     console.log("GETTING THREADS", ctx.params);
      // },
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
