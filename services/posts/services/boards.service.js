/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const faker = require('faker');
const dayjs = require('dayjs');

const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { toDeepObjectId } = require('../../../utils/func');

module.exports = {
  name: 'boards',
  mixins: [MongoDbMixin('boards', 'nocheto')],
  settings: {
    fields: [
      '_id',
      'name',
      'description',
      'icon',
      'logo',
      'palette',
      'configurations',
      'active',
      'followers',
      'posts',
      'createdAt',
      'creator',
    ],
    entityValidator: {
      name: 'string',
      description: { type: 'string', optional: true },
      icon: { type: 'string', optional: true },
      logo: { type: 'string', optional: true },
      palette: {
        type: 'object',
        optional: true,
        props: {
          primary: {
            type: 'object',
            optional: true,
            props: {
              light: { type: 'string', optional: true },
              main: { type: 'string', optional: true },
              dark: { type: 'string', optional: true },
              contrastText: { type: 'string', optional: true },
            },
          },
          secondary: {
            type: 'object',
            optional: true,
            props: {
              light: { type: 'string', optional: true },
              main: { type: 'string', optional: true },
              dark: { type: 'string', optional: true },
              contrastText: { type: 'string', optional: true },
            },
          },
        },
      },
      configurations: {
        type: 'object',
        optional: true,
        props: {
          packingList: {
            type: 'object',
            optional: true,
            props: {
              path: {
                type: 'object',
                optional: true,
                props: {
                  dtc: { type: 'string', optional: true },
                  Wholesale: { type: 'string', optional: true },
                },
              },
            },
          },
        },
      },
      active: { type: 'boolean', default: true },
      creator: { type: 'object', optional: true },
    },
    populates: {
      followers: {
        handler(ids, items, handler, ctx) {
          return Promise.all(
            items.map((board) => {
              if (!board.followers) return board;

              const ObjIds = Object.keys(board.followers).map((id) => ObjectId(id));
              return ctx
                .call('users.list', {
                  query: {
                    _id: {
                      $in: ObjIds,
                    },
                    // _id: { $in: ObjIds },
                  },
                  fields: ['_id', 'username', 'photoUrl'],
                })
                .then((users) => {
                  console.log('Followers', users);
                  board.followers = users;
                  return board;
                });
            })
          );
        },
      },
      posts: {
        handler(ids, items, handler, ctx) {
          return Promise.all(
            items.map((board) =>
              ctx
                .call('posts.list', {
                  ...ctx.params,
                  query: {
                    board: ObjectId(board._id),
                  },
                  fields: ['_id', 'votes', 'author', 'title', 'text', 'image', 'comments'],
                })
                .then((posts) => {
                  board.posts = posts;
                  return board;
                })
            )
          );
        },
      },
    },
  },
  hooks: {
    before: {
      async list(ctx) {},
      update(ctx) {
        ctx.params = toDeepObjectId(ctx.params);
      },
    },
  },
  actions: {
    // get: {
    //     rest: "GET /:id",
    //     async handler(ctx) {
    //         return this._find(ctx, {
    //             query: { name: ctx.params.id },
    //             populate: ctx.params.populate ? ctx.params.populate.split(",") : [],
    //         }).then(([board]) => board);
    //     },
    // },
    byName: {
      rest: 'GET /:board',
      async handler(ctx) {
        return this._find(ctx, {
          query: { name: ctx.params.board },
          populate: ctx.params.populate ? ctx.params.populate.split(',') : [],
        }).then(([board]) => board);
      },
    },
    fake: {
      rest: 'GET /fake',
      params: {
        user: {
          type: 'string',
          ObjectId,
          optional: true,
        },
      },
      async handler(ctx) {
        const user = ObjectId(ctx.params.user) || this.extractUser(ctx);
        if (!user) return this.Promise.reject('User not found');

        const template = {
          primary: {
            light: '#4791db',
            main: '#1976d2',
            dark: '#115293',
            contrastText: '#ffffff',
          },
          secondary: {
            light: '#4791db',
            main: '#1976d2',
            dark: '#115293',
            contrastText: '#ffffff',
          },
        };

        return this._create(ctx, {
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
          icon: faker.image.imageUrl(),
          logo: faker.image.imageUrl(),
          template,
          createdAt: dayjs().toDate(),
          active: true,
          creator: user,
          followers: {
            [String(user)]: true,
          },
        });
      },
    },
    fakeBulk: {
      rest: 'GET /fake/bulk',
      async handler(ctx) {
        const num = 15;
        const users = await ctx.call('users.find', { fields: ['_id'] });
        const ids = [];
        const max = users.length;
        // eslint-disable-next-line no-plusplus
        const randomUser = () => {
          const r = Math.floor(Math.random() * (max - 0 + 1) + 0);
          try {
            return users[r]._id;
          } catch (err) {
            return randomUser();
          }
        };
        while (ids.length < num) {
          ids.push(randomUser());
        }

        const data = [];
        while (data.length < num) {
          data.push(ctx.call('boards.fake', { user: ids[data.length] }));
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
          usrId = ctx.meta.oauth.user._id;
        } else {
          usrId = ctx.meta.oauth.id;
        }
      }
      return ObjectId(usrId);
    },
  },
};
