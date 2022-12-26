const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
  rest: 'GET /whoiam',
  handler(ctx) {
    return this.getById(ctx.meta.oauth.user.id)
      .then((user) => {
        if (!user) return this.Promise.reject(new MoleculerClientError('User not found!', 400));

        return this.transformDocuments(ctx, { fields: ['_id', 'username'] }, user);
      })
      .then((user) => this.transformEntity2(user, true, ctx.meta.token));
  },
};
