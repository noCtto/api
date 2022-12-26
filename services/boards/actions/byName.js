module.exports = {
  rest: 'GET /:board',
  async handler(ctx) {
    return this._find(ctx, {
      query: { name: ctx.params.board },
      populate: ctx.params.populate ? ctx.params.populate.split(',') : [],
    }).then(([board]) => board);
  },
};
