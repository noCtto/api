

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const { page, limit } = ctx.params;
    const trending = await ctx.call('votes.trending', { page, limit });
    const posts = await ctx.call('posts.find', {
      query: { vid: { $in: trending } },
      fields: [
        '_id',
        'tid',
        'uid',
        'title',
        'text',
        'createdAt',
        'updatedAt',
        'vid',
        'body',
        'comments',
        'votes',
        'author',
      ],
      populate: ['votes', 'author', 'comments', 'votes'],
    });
    console.log('This result is from the service', posts);
    return posts;
  },
};
