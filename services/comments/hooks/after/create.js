module.exports = async function comment(ctx, response) {
  const post = await ctx.call('posts.get', {
    id: response.pid.toString(),
    populate: ['comments'],
    fields: ['_id', 'comments'],
  });
  ctx.call('io.broadcast', {
    namespace: '/',
    event: `post-update-comment-count`,
    args: [
      {
        ...response,
        ...post,
      },
    ],
  });
  return response;
};
