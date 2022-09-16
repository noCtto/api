const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const faker = require('faker');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');

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
                .then((resp) => ({
                  ...item,
                  comments: resp,
                }))
            )
          );
        },
      },
    },
  },
  actions: {
    fake: {
      rest: 'POST /fake',
      params: {},
      async handler(ctx) {
        const boards = await ctx.call('boards.find', {});
        return this.actions.create(
          {
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph(),
            image: faker.image.imageUrl(),
            board: boards[1]._id,
          },
          ctx
        );
      },
    },
    fakeBulk: {
      rest: 'GET /fake/bulk',
      async handler(ctx) {
        const num = 15;

        const users = await ctx
          .call('users.find', { fields: ['_id'] })
          .then((res) => res.map((u) => u._id));

        const boards = await ctx
          .call('boards.find', { fields: ['_id'] })
          .then((res) => res.map((b) => b._id));

        const ids = [];
        const max = users.length;
        const maxb = boards.length;
        // eslint-disable-next-line no-plusplus
        const randomId = (m, u) => {
          const r = faker.datatype.number({ min: 0, max: m });
          try {
            return u[r] !== undefined ? u[r] : randomId(m, u);
          } catch (err) {
            return randomId(m, u);
          }
        };

        while (ids.length < num) {
          ids.push(randomId(max, users));
        }

        const data = [];
        while (data.length < num) {
          data.push(
            ctx.call('posts.fake', {
              user: ids[data.length],
              board: randomId(maxb, boards),
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
        const { title, body, image, board, tags, labels } = ctx.params;

        const post = await this._create(ctx, {
          title,
          body,
          image,
          createdAt: dayjs().toDate(),
          board: ObjectId(board),
          author,
          tags,
          labels,
        });

        const votes = await ctx.call('votes.create', {
          post: post._id,
          board: ObjectId(board),
          voters: {
            [author]: 1,
          },
        });

        const thread = await ctx.call('threads.create', { post: ObjectId(post._id) });

        return this._update(ctx, {
          id: post._id,
          votes: ObjectId(votes._id),
          thread: ObjectId(thread._id),
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
      '*': (ctx) => {},
      create(ctx) {
        // ctx.params.author = this.extractUser(ctx);
      },
      get(ctx) {
        const user = this.extractUser(ctx);
        console.log('THIS user', ctx.meta);
      },
      vote(ctx) {
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
        ctx.params.sort = { _id: -1, comments: 1 };
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
    after: {},
  },
};
