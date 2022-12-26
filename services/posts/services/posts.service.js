/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const faker = require('faker');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const { randomId } = require('../../../utils/func');

const aggretation = [
  {
    $project: {
      as: {
        $objectToArray: '$voters',
      },
    },
  },
  {
    $project: {
      _id: '$_id',
      voters: {
        $size: '$as',
      },
    },
  },
  {
    $sort: {
      voters: -1,
    },
  },
];

module.exports = {
  mixins: [MongoDbMixin('posts', 'nocheto')],
  settings: {
    validator: true,
    fields: [
      '_id',
      'title',
      'body',
      'image',
      'createdAt',
      'author',
      'board',
      'tags',
      'comments',
      'thread',
      'votes',
      'tags',
      'label',
    ],
    entityValidator: {
      body: {
        type: 'string',
        optional: false,
      },
      title: {
        type: 'string',
        optional: true,
      },
      image: {
        type: 'string',
        min: 5,
        trim: true,
        required: true,
        optional: true,
      },
      author: {
        type: 'objectID',
        ObjectID: ObjectId,
        optional: false,
      },
      board: {
        type: 'objectID',
        ObjectID: ObjectId,
        optional: true,
      },
      votes: {
        type: 'objectID',
        ObjectID: ObjectId,
        optional: true,
      },
      comments: {
        type: 'object',
        optional: true,
      },
      thread: {
        type: 'object',
        optional: true,
        default: null,
      },
      tags: {
        type: 'array',
        optional: true,
      },
      label: {
        type: 'array',
        optional: true,
      },
    },
    populates: {
      author: {
        action: 'users.get',
        params: {
          fields: ['_id', 'name', 'imageUrl', 'username', 'image'],
          populate: ['gravatar'],
        },
      },
      board: {
        action: 'boards.get',
        params: {
          fields: ['_id', 'name', 'description'],
        },
      },
      votes: {
        action: 'votes.get',
        params: {
          fields: ['_id', 'count', 'total', 'voted'],
          populate: ['count', 'voted'],
        },
      },
      thread: {
        action: 'threads.get',
        params: {
          fields: ['_id', 'comments'],
          populate: ['comments'],
        },
      },
      comments: {
        handler(ids, items, handler, ctx) {
          return this.Promise.all(
            items.map((item) =>
              ctx
                .call('comments.count', {
                  query: {
                    tid: ObjectId(item.thread),
                    cid: { $exists: false },
                  },
                })
                .then((resp) => {
                  const o = item;
                  o.comments = resp;
                  return o;
                })
            )
          );
        },
      },
    },
  },
  actions: {
    fake: {
      rest: 'POST /fake/',
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

        const ids = [];
        const max = users.length;

        while (ids.length < num) {
          ids.push(randomId(max, users));
        }

        const data = [];
        while (data.length < num) {
          data.push(
            ctx.call('posts.create', {
              author: ids[data.length],
              // title: faker.lorem.sentence(),
              body: faker.lorem.paragraph(),
              // image: faker.image.imageUrl(),
            })
          );
        }
        return Promise.all(data);
      },
    },
    create: {
      params: {
        title: { type: 'string', optional: true },
        body: { type: 'string', optional: true },
        image: { type: 'string', optional: true },
        board: { type: 'string', optional: true },
        tags: { type: 'string', optional: true },
        labels: { type: 'string', optional: true },
      },
      async handler(ctx) {
        const author = ctx.params.author ? ObjectId(ctx.params.author) : this.extractUser(ctx);
        if (!author) return this.Promise.reject('User not found');
        const { body } = ctx.params;

        const post = await this._create(ctx, {
          body,
          author,
          createdAt: dayjs().toDate(),
        });

        const votes = await ctx.call('votes.create', {
          post: ObjectId(post._id),
          voters: {
            [author]: 1,
          },
        });

        const thread = await ctx.call('threads.create', { post: ObjectId(post._id) });

        return this._update(ctx, {
          id: post._id,
          votes: ObjectId(votes._id),
          thread: ObjectId(thread._id),
        }).then((json) =>
          this.transformDocuments(
            ctx,
            {
              populate: ['author', 'votes', 'voted', 'comments'],
            },
            json
          )
        );
      },
    },
    push: {
      async handler(ctx) {
        const post = await ctx.call('posts.find', { limit: 1 });
        return ctx.call('io.broadcast', {
          namespace: '/', // optional
          event: 'push-posts',
          args: [post], // optional
        });
      },
    },
    upload: {
      async handler(ctx) {
        return new this.Promise((resolve, reject) => {
          const ext = mime.extension(ctx.meta.mimetype);
          const filename = sha256(`${ctx.meta.filename}${this.randomName()}`);
          const name = `${filename}.${ext}`;
          const filePath = path.join(uploadDir, name);
          const f = fs.createWriteStream(filePath);
          f.on('close', () => {
            // File written successfully
            this.logger.info(`Uploaded file stored in '${filePath}'`);
            resolve({ file: { path: filePath, name }, meta: ctx.meta });
          });

          ctx.params.on('error', (err) => {
            this.logger.info('File error received', err.message);
            reject(err);

            // Destroy the local file
            f.destroy(err);
          });

          f.on('error', () => {
            // Remove the errored file.
            fs.unlinkSync(filePath);
          });

          ctx.params.pipe(f);
        }).then(({ file }) => {
          const { name } = file;
          // const arr = [];
          // for (let i = 0; i < 100; i++) {
          //     arr.push(
          //         ctx.call("posts.create", { ...ctx.meta.$multipart, image: name })
          //     );
          // }
          // return Promise.all(arr);
          return ctx.call('posts.create', { ...ctx.meta.$multipart, image: name });
        });
      },
    },
    all: {
      handler(ctx) {
        return this._list(ctx, {
          populate: ['comments', 'board', 'author', 'votes'],
          fields: ['_id', 'votes', 'author', 'createdAt', 'comments', 'board', 'body'],
          sort: '-createdAt',
          page: 1,
          pageSize: 10,
        });
      },
    },
  },
  methods: {
    randomId: (m, u) => {
      const r = faker.datatype.number({ min: 0, max: m });
      try {
        return u[r] !== undefined ? u[r] : this.randomId(m, u);
      } catch (err) {
        return this.randomId(m, u);
      }
    },
    randomName: () => `unnamed_${Date.now()}`,
    extractUser(ctx) {
      if (ctx.meta.oauth) {
        if (ctx.meta.oauth.user) {
          return ObjectId(ctx.meta.oauth.user.id);
        }
        return ObjectId(ctx.meta.oauth.id);
      }
      return false;
    },
  },
  hooks: {
    before: {
      // eslint-disable-next-line func-names
      '*': () => {},
      create() {
        // ctx.params.author = this.extractUser(ctx);
      },
      get() {},
      vote() {
        // ctx.params.user = this.extractUser(ctx);
      },
      upvote(ctx) {
        ctx.params.d = true;
        // ctx.params.user = this.extractUser(ctx);
      },
      downvote(ctx) {
        ctx.params.d = false;
        // ctx.params.user = this.extractUser(ctx);
      },
      list(ctx) {
        ctx.params.sort = { _id: -1, comments: -1 };
      },
      update(ctx) {
        const { id } = ctx.params;
        const user = this.extractUser(ctx);
        return this._get(ctx, { id, fields: ['_id', 'author'] }).then((post) => {
          if (String(post.author) !== String(user))
            return this.Promise.reject('You are not the author of this post', 200, 200);
          return post;
        });
      },
    },
    after: {
      // '*': () => {},
      create: (ctx, response) => {
        ctx.call('io.broadcast', {
          namespace: '/', // optional
          event: 'push-posts',
          args: [response], // optional
          // volatile: true, // optional
          // local: true, // optional
          // rooms: ['room1', 'room2'], // optional
        });
        return response;
      },
    },
  },
};
