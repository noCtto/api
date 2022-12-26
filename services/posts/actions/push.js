module.exports = async function push(ctx) {
  const post = await ctx.call('posts.find', { limit: 1 });
  return ctx.call('io.broadcast', {
    namespace: '/', // optional
    event: 'push-posts',
    args: [post], // optional
  });
};
