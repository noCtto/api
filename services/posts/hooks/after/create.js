module.exports = function create(ctx, response) {
  ctx.call('io.broadcast', {
    namespace: '/', // optional
    event: 'push-posts',
    args: [response], // optional
    // volatile: true, // optional
    // local: true, // optional
    // rooms: ['room1', 'room2'], // optional
  });
  return response;
};
