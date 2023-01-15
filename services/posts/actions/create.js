const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');

module.exports = {
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
};
