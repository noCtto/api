/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const { ValidationError } = require('moleculer').Errors;
const dayjs = require('dayjs');
const faker = require('faker');
const { randomId } = require('../../../utils/func');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');

const populates = require('../populates');

const Entity = require('../entities/votes.entity');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  mixins: [MongoDbMixin('votes', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates: {
      post: {
        action: 'posts.get',
      },
      ...populates,
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
    bulk: {
      rest: 'POST /bulk',
      params: {
        num: {
          type: 'number',
          optional: true,
        },
      },
      async handler(ctx) {
        const num = ctx.params.num || 1;

        const users = await ctx
          .call('users.find', { fields: ['_id'] })
          .then((res) => res.map((u) => u._id));

        const votes = await ctx
          .call('votes.find', { fields: ['_id'] })
          .then((res) => res.map((u) => u._id));

        const ids = [];

        while (ids.length < num) {
          ids.push({
            id: randomId(votes.length, votes),
            user: randomId(users.length, users),
          });
        }

        const data = [];
        while (data.length < num) {
          const { id, user } = ids[data.length];

          data.push(
            ctx.call('votes.fake', {
              id,
              user,
            })
          );
        }
        return Promise.all(data);
      },
    },
    fake: {
      rest: 'POST /fake',
      params: {
        id: {
          type: 'string',
          optional: true,
        },
        user: {
          type: 'string',
          required: true,
        },
        d: {
          type: 'boolean',
          optional: true,
        },
      },
      handler(ctx) {
        const { id, user } = ctx.params;
        return this.Promise.resolve(
          this._get(ctx, { id }).then((res) => {
            if (!res) return this.Promise.reject(new ValidationError('no vote'));
            const { voters } = res;
            return this._update(ctx, {
              id,
              voters: {
                ...voters,
                [`${ObjectId(user)}`]: Number(ctx.params.d || faker.datatype.boolean()),
              },
            });
          })
        );
      },
    },
  },
  methods: {
    vote(ctx) {
      const { id, d } = ctx.params;
      const user = this.extractUser(ctx);
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
      get() {},
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
