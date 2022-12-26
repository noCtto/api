/* eslint-disable no-param-reassign */
module.exports = async function transformEntity(
  user,
  withToken = true,
  token = null,
  extra = {},
  ctx
) {
  if (user) {
    delete user.password;
    delete user.createdAt;
    delete user.active;
    if (withToken) user.token = token || (await this.validateSession(user, extra, ctx));
  }

  return user;
};
