module.exports = function vote(ctx, response) {
  const b = {
    ...response,
    id: ctx.params.id,
  };
  console.log('Broadcasting vote count', response);
  ctx.call('io.broadcast', {
    namespace: '/',
    event: `post-update-vote-count`,
    args: [b],
  });
  return response;
};
