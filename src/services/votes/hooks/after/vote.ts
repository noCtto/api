export default function vote(ctx, response) {
  console.log('Broadcasting vote count', response);
  ctx.call('io.broadcast', {
    namespace: '/',
    event: `update_votes_count`,
    args: [
      {
        ...response,
      },
    ],
  });
  return response;
};
