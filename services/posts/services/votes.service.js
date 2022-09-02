/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const { ValidationError } = require('moleculer').Errors;
const dayjs = require('dayjs');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');

module.exports = {
  mixins: [MongoDbMixin('votes')],
  settings: {
    validator: true,
    fields: ['_id', 'post', 'voters', 'count', 'voted', 'd', 'createdAt', 'total'],
    entityValidator: {
      voters: {
        type: 'object',
        optional: true,
      },
      count: {
        type: 'number',
        optional: true,
      },
      total: {
        type: 'number',
        optional: true,
      },
      voted: {
        type: 'number',
        optional: true,
      },
    },
    populates: {
      post: {
        action: 'posts.get',
      },
      async count(ids, items) {
        return items.map((item) => {
          const keys = Object.keys(item.voters);
          const { length } = keys;
          item.count = keys.map((key) => item.voters[key]).reduce((a, b) => a + b, 0);
          item.total = length;
          return item;
        });
      },
      voted(ids, items, handler, ctx) {
        const user = this.extractUser(ctx);
        this.logger.info('Checking if voted', ctx.params);
        return items.map((item) => {
          item.voted = item.voters[String(user)] !== undefined;
          if (item.voted) item.d = item.voters[String(user)];
          return item;
        });
      },
    },
  },
  actions: {
    vote: {
      rest: 'POST /vote',
      params: {
        id: { type: 'objectID', ObjectID: ObjectId, optional: false },
        d: 'boolean',
      },
      handler(ctx) {
        return this.Promise.resolve(this.vote(ctx));
      },
    },
  },
  methods: {
    vote(ctx) {
      console.log('Voting', ctx.params);
      const { id, d } = ctx.params;
      const user = this.extractUser(ctx);
      console.log('Voting User', user);
      if (!user) return this.Promise.reject(new ValidationError('no user'));
      return this._get(ctx, { id }).then((card) => {
        let bool = d;
        if (!card) this.Promise.reject(new ValidationError('error', 'number', 400));

        const { voters } = card;
        if (card.voters[String(user)] !== undefined && card.voters[String(user)] === d) {
          bool = null;
        }
        return this._update(ctx, {
          id: card._id,
          voters: {
            ...voters,
            [String(user)]: bool,
          },
          updatedAt: dayjs().toDate(),
        }).then((json) =>
          this.transformDocuments(
            { ...ctx },
            {
              populate: ['votes', 'voted'],
              fields: ['id', 'count', 'total', 'voted', 'd'],
            },
            json
          )
        );
      });
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
      '*': () => {},
      create() {},
      list() {},
      get(ctx) {
        console.log('votes get', ctx.meta);
      },
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
