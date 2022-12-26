const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
  rest: 'POST /forceLogout',
  cache: false,
  params: {
    username: { type: 'string' },
    password: { type: 'string', min: 35 },
    environment: { type: 'string' },
    fingerprint: {
      type: 'string',
      default: 'localhost',
      optional: true,
    },
  },
  handler(ctx) {
    const { username } = ctx.params;
    return this._find(ctx, {
      query: {
        username: { $regex: username },
      },
    }).then(([user]) => {
      if (!user) {
        return this.Promise.reject(new MoleculerClientError('No user found', 400, 'Error2'));
      }
      return this.Promise.resolve(
        ctx
          .call('users.logout', { id: user._id })
          .then(() => ({
            msg: 'Ok!',
          }))
          .catch(() => ({ msg: 'Ok!' }))
      );
    });
  },
};
