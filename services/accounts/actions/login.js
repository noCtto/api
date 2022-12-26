const { MoleculerClientError } = require('moleculer').Errors;
const { sha256 } = require('../../../utils/func');

module.exports = {
  rest: 'POST /login',
  cache: false,
  authorization: false,
  params: {
    username: { type: 'string' },
    password: { type: 'string', min: 4 },
    environment: { type: 'string', optional: true },
    fingerprint: {
      type: 'string',
      default: 'localhost',
      optional: true,
    },
    csrfToken: {
      type: 'string',
      optional: true,
    },
  },
  handler(ctx) {
    const { email, password, username } = ctx.params;
    if (!password || (!username && !email))
      return this.Promise.reject(new MoleculerClientError('Invalid credentials', 400, ctx.params));
    return this._find(ctx, {
      query: { $or: [{ email }, { username }] },
      fields: ['_id', 'name', 'lastName', 'username', 'email', 'photoUrl', 'password'],
      // populate: ['permissions', 'companies', 'role'],
    })
      .then((users) => {
        const user = users.length > 0 ? users[0] : null;
        if (user) {
          if (user.password === sha256(password)) {
            return user;
          }
        }
        console.log('Logging In!', user);
        return this.Promise.reject(
          new MoleculerClientError('Email or password is invalid!', 422, 'account', [
            // {
            //     field: 'email',
            //     message: 'is not found',
            // },
            user,
          ])
        );
      })
      .then((user) => {
        const update = {
          $set: {
            lastLogin: new Date(),
          },
        };

        return this.adapter.updateById(user._id, update).then(() => user);
      })
      .then((user) => this.transformDocuments(ctx, {}, user))
      .then(async (user) => {
        const token = await this.validateSession(user, ctx);
        return this.transformEntity2(user, token);
      });
  },
};
