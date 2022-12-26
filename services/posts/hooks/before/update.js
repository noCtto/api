module.exports = function update(ctx) {
  const { id } = ctx.params;
  const user = this.extractUser(ctx);
  return this._get(ctx, { id, fields: ['_id', 'author'] }).then((post) => {
    if (String(post.author) !== String(user))
      return this.Promise.reject('You are not the author of this post', 200, 200);
    return post;
  });
};
