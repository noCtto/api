module.exports = async function comment(ctx, response) {
  const post = await ctx.call('posts.get', {
    id: response.pid.toString(),
    populate: ['comments'],
    fields: ['_id', 'comments'],
  });

  const q = {
    count: post.comments,
    pid: post._id,
    tid: response.tid,
  };

  console.log('Broadcasting update-comment-count', q);
  ctx.call('io.broadcast', {
    namespace: '/',
    event: `post_update_comment_count`,
    args: [q],
  });

  console.log('Broadcasting thread-push-comment', response);
  ctx.call('io.broadcast', {
    namespace: '/',
    event: `thread-push-comment`,
    args: [
      {
        ...response,
      },
    ],
  });
  return response;
};
