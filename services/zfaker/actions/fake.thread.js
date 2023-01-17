module.exports = {
  rest: 'GET /fake/thread/:tid',
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
};
