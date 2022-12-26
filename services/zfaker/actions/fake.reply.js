module.exports = {
  rest: 'GET /fake/reply/:cid',
  params: {
    cid: 'string',
  },
  handler(ctx) {
    console.log('Fake reply', ctx.params);
  },
};
