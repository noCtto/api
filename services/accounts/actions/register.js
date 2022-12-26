const { MoleculerClientError } = require('moleculer').Errors;
const dayjs = require('dayjs');

module.exports = {
  params: {
    username: 'string|min:4',
    email: 'email',
    password: 'string|min:8',
  },
  handler(ctx) {
    const { username, email, password } = ctx.params;
    return this._find(ctx, { query: { email } }).then(([registeredEmail]) => {
      if (registeredEmail)
        return this.Promise.reject(new MoleculerClientError('Email already registered', 400));

      return this._find(ctx, { query: { username } }).then(([userNameTaken]) => {
        if (userNameTaken)
          return this.Promise.reject(new MoleculerClientError('Username already taken.', 400));
        return this._create(ctx, {
          username,
          email,
          password,
          createdAt: dayjs().toDate(),
        }).then((user) => {
          if (!user) return this.Promise.reject(new MoleculerClientError('User Creation Error'));
          return this.Promise.resolve({ status: true, msg: 'welcome', user });
        });
      });
    });
  },
};
