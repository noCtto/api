const { ObjectId } = require('mongodb');
const { toDeepObjectId } = require('../../../utils/func');

module.exports = {
  rest: 'POST /',
  params: {
    tid: {
      type: 'string',
      optional: false,
    },
    pid: {
      type: 'string',
      optional: false,
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
      uid: author,
    };

    if (!params.cid || params.cid === 'null') {
      delete params.cid;
    }

    const votes = await ctx.call('votes.create', {
      voters: {
        [author]: 1,
      },
      cid: params.cid,
      pid: params.pid,
      tid: params.tid,
      uid: author,
    });

    const comment = await this._create(
      ctx,
      toDeepObjectId({ ...params, votes: ObjectId(votes._id) })
    ).then((json) =>
      this.transformDocuments(ctx, { populate: ['votes', 'author', 'replies'] }, json)
    );
    return comment;
  },
};
